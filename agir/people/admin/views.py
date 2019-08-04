import csv
from uuid import uuid4

from django.contrib import messages
from django.core.exceptions import PermissionDenied
from django.db import transaction
from django.http import HttpResponse, HttpResponseRedirect, Http404, QueryDict
from django.shortcuts import get_object_or_404
from django.template.response import TemplateResponse
from django.urls import reverse
from django.utils.translation import ugettext_lazy as _
from django.views import View
from django.views.generic import FormView, TemplateView
from django.views.generic.detail import SingleObjectMixin

from agir.lib.admin import AdminViewMixin
from agir.people.actions.management import merge_persons
from agir.people.admin.forms import AddPersonEmailForm, ChoosePrimaryAccount
from agir.people.models import Person
from agir.people.person_forms.display import get_formatted_submissions
from agir.people.person_forms.models import PersonForm


class FormSubmissionViewsMixin:
    def get_form_submission_qs(self, form):
        return form.submissions.all()

    def generate_result_table(self, form, html=True, fieldsets_titles=True):
        submission_qs = self.get_form_submission_qs(form)

        headers, submissions = get_formatted_submissions(
            submission_qs, html=html, fieldsets_titles=fieldsets_titles
        )

        return {"form": form, "headers": headers, "submissions": submissions}

    def view_results(self, request, pk, title=None):
        if not self.has_change_permission(request) or not request.user.has_perm(
            "people.change_personform"
        ):
            raise PermissionDenied

        form = PersonForm.objects.get(id=pk)
        table = self.generate_result_table(form)

        context = {
            "has_change_permission": True,
            "title": title or ("Réponses du formulaire: %s" % form.title),
            "opts": self.model._meta,
            "form": table["form"],
            "headers": table["headers"],
            "submissions": table["submissions"],
        }

        return TemplateResponse(request, "admin/personforms/view_results.html", context)

    def download_results(self, request, pk):
        if not self.has_change_permission(request):
            raise PermissionDenied()

        form = get_object_or_404(PersonForm, id=pk)
        table = self.generate_result_table(form, html=False, fieldsets_titles=False)

        response = HttpResponse(content_type="text/csv")
        response["Content-Disposition"] = 'attachment; filename="{0}.csv"'.format(
            form.slug
        )

        writer = csv.writer(response)
        writer.writerow(table["headers"])
        for submission in table["submissions"]:
            writer.writerow(submission)

        return response

    def create_result_url(self, request, pk, clear=False):
        if not self.has_change_permission(request):
            raise PermissionDenied()

        form = get_object_or_404(PersonForm, id=pk)
        form.result_url_uuid = None if clear else uuid4()
        form.save()

        return HttpResponseRedirect(
            reverse("admin:people_personform_change", args=[pk])
        )


class AddPersonEmailView(AdminViewMixin, SingleObjectMixin, FormView):
    form_class = AddPersonEmailForm
    queryset = Person.objects.all()
    template_name = "admin/people/person/add_email.html"

    def get(self, request, *args, **kwargs):
        self.object = self.get_object()
        return super().get(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        self.object = self.get_object()
        return super().post(request, *args, **kwargs)

    def form_valid(self, form):
        new_email = form.cleaned_data["email"]

        try:
            p2 = Person.objects.get_by_natural_key(new_email)
        except Person.DoesNotExist:
            self.object.add_email(new_email, primary=True)
            messages.add_message(
                request=self.request,
                level=messages.SUCCESS,
                message=f"Adresse {new_email} ajoutée à ce compte",
            )
            return HttpResponseRedirect(
                reverse("admin:people_person_change", args=[self.object.pk])
            )
        else:
            if p2 == self.object:
                return HttpResponseRedirect(
                    reverse("admin:people_person_change", args=[self.object.pk])
                )

            q = QueryDict(mutable=True)
            q.setlist("id", [self.object.pk, p2.pk])
            return HttpResponseRedirect(
                redirect_to=f'{reverse("admin:people_person_merge")}?{q.urlencode()}'
            )

    def get_context_data(self, **kwargs):
        kwargs = super().get_context_data(**kwargs)

        kwargs.update(
            self.get_admin_helpers(form=kwargs["form"], fields=kwargs["form"].fields)
        )

        return kwargs


class MergePersonsView(AdminViewMixin, FormView):
    form_class = ChoosePrimaryAccount
    template_name = "admin/people/person/merge.html"

    def dispatch(self, request, *args, **kwargs):
        person_ids = request.GET.getlist("id")

        if not person_ids:
            raise Http404()

        try:
            self.persons = [Person.objects.get(pk=pk) for pk in person_ids]
        except (Person.DoesNotExist, ValueError):
            raise Http404()

        if len(set(self.persons)) != len(self.persons):
            raise Http404()

        return super().dispatch(request, *args, **kwargs)

    def get_form_kwargs(self):
        kwargs = super().get_form_kwargs()
        kwargs["persons"] = self.persons
        return kwargs

    def get_context_data(self, **kwargs):
        kwargs = super().get_context_data(**kwargs)

        kwargs["persons"] = self.persons
        kwargs.update(
            self.get_admin_helpers(form=kwargs["form"], fields=kwargs["form"].fields)
        )

        return kwargs

    def form_valid(self, form):
        primary_account = form.cleaned_data["primary_account"]

        with transaction.atomic():
            for other_account in [
                account for account in self.persons if account != primary_account
            ]:
                merge_persons(primary_account, other_account)

        messages.add_message(
            request=self.request, level=messages.SUCCESS, message=f"Comptes fusionnés"
        )
        return HttpResponseRedirect(
            reverse("admin:people_person_change", args=[primary_account.pk])
        )
