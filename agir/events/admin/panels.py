from django.contrib import admin
from django.urls import reverse
from django.utils.safestring import mark_safe
from django.utils.translation import ugettext_lazy as _
from django.contrib.gis.admin import OSMGeoAdmin
from django.db.models import F, Sum
from django.urls import path
from django.utils import timezone
from django.utils.encoding import force_text
from django.utils.html import format_html, escape

from ...api.admin import admin_site
from ...groups.models import SupportGroup
from ...lib.admin import CenterOnFranceMixin
from ...lib.utils import front_url

from .. import models

from . import actions
from . import views
from .forms import EventAdminForm


class EventStatusFilter(admin.SimpleListFilter):
    title = _('Statut')

    parameter_name = 'status'

    def lookups(self, request, model_admin):
        return (
            ('all', _('All')),
            ('finished', _('Terminé')),
            ('current', _('En cours')),
            ('upcoming', _('À venir')),
        )

    def choices(self, changelist):
        for lookup, title in self.lookup_choices:
            yield {
                'selected': (lookup == 'upcoming' and self.value() is None) or self.value() == force_text(lookup),
                'query_string': changelist.get_query_string({self.parameter_name: lookup}, []),
                'display': title,
            }

    def queryset(self, request, queryset):
        now = timezone.now()
        if self.value() == 'finished':
            return queryset.filter(end_time__lt=now)
        elif self.value() == 'current':
            return queryset.filter(start_time__lte=now, end_time__gte=now)
        elif self.value() == 'all':
            return queryset
        else:
            return queryset.filter(start_time__gt=now)


class EventHasReportFilter(admin.SimpleListFilter):
    title = _('Compte-rendu présent')

    parameter_name = 'has_report'

    def lookups(self, request, model_admin):
        return (
            ('yes', _('Présent')),
            ('no', _('Absent')),
        )

    def queryset(self, request, queryset):
        if self.value() == 'yes':
            return queryset.exclude(report_content='')
        if self.value() == 'no':
            return queryset.filter(report_content='')


class OrganizerConfigInline(admin.TabularInline):
    model = models.OrganizerConfig
    fields = ('person_link', 'as_group')
    readonly_fields = ('person_link', )

    def get_form(self, obj):
        form = super().get_form()
        form.fields['as_group'].queryset = SupportGroup.objects.filter(memberships__person=obj.person, memberships__is_manager=True)

    def person_link(self, obj):
        return mark_safe(format_html(
            '<a href="{}">{}</a>',
            reverse('admin:people_person_change', args=(obj.person.id,)),
            escape(obj.person.email)
        ))
    person_link.short_description = _("Personne")

    def has_add_permission(self, request):
        return False


class EventImageInline(admin.TabularInline):
    model = models.EventImage
    fields = ('image_link', 'author_link', 'legend')
    readonly_fields = ('image_link', 'author_link',)
    extra = 0

    def has_add_permission(self, request):
        return False

    def image_link(self, obj):
        return mark_safe(format_html(
            '<a href="{}"><img src="{}"></a>',
            obj.image.url,
            obj.image.admin_thumbnail.url
        ))
    image_link.short_description = _('Image')

    def author_link(self, obj):
        return mark_safe(format_html(
            '<a href="{}">{}</a>',
            reverse('admin:people_person_change', args=(obj.author.id,)),
            escape(obj.author.email)
        ))
    author_link.short_description = _("Auteur")


@admin.register(models.Event, site=admin_site)
class EventAdmin(CenterOnFranceMixin, OSMGeoAdmin):
    form = EventAdminForm

    fieldsets = (
        (None, {
            'fields': ('id', 'name', 'link', 'created', 'modified', 'add_organizer_button')
        }),
        (_('Informations'), {
            'fields': ('subtype', 'description', 'allow_html', 'image', 'start_time', 'end_time', 'calendars', 'tags', 'published'),
        }),
        (_('Inscription'), {
            'fields': ('max_participants', 'allow_guests', 'subscription_form', 'payment_parameters'),
        }),
        (_('Lieu'), {
            'fields': ('location_name', 'location_address1', 'location_address2', 'location_city', 'location_zip',
                       'location_state', 'location_country', 'coordinates', 'coordinates_type', 'redo_geocoding')
        }),
        (_('Contact'), {
            'fields': ('contact_name', 'contact_email', 'contact_phone', 'contact_hide_phone')
        }),
        (_('Compte-rendu'), {
            'fields': ('report_content', 'report_image')
        }),
        (_('NationBuilder'), {
            'fields': ('nb_id', 'nb_path', 'location_address')
        })
    )

    inlines = (OrganizerConfigInline, EventImageInline)

    readonly_fields = ('id', 'link', 'add_organizer_button', 'organizers', 'created', 'modified', 'coordinates_type')
    date_hierarchy = 'start_time'

    list_display = ('name', 'published', 'calendar_names', 'location_short', 'attendee_count',
                    'start_time', 'created')
    list_filter = (
        'published',
        'subtype__type',
        'subtype',
        'calendars',
        EventHasReportFilter,
        EventStatusFilter,
        'tags',
    )

    search_fields = ('name', 'description', 'location_city', 'location_country')

    actions = (actions.export_events, actions.make_published, actions.unpublish)

    def location_short(self, object):
        return _('{zip} {city}, {country}').format(
            zip=object.location_zip,
            city=object.location_city,
            country=object.location_country.name
        )
    location_short.short_description = _("Lieu")
    location_short.admin_order_field = 'location_city'

    def calendar_names(self, object):
        return ', '.join(c.name for c in object.calendars.all())
    calendar_names.short_description = _('Agendas')

    def add_organizer_button(self, object):
        if object.pk is None:
            return mark_safe('-')
        return format_html(
            '<a href="{}" class="button">+ Organisateur</a>',
            reverse('admin:events_event_add_organizer', args=(object.pk,))
        )
    add_organizer_button.short_description = _('Ajouter un organisateur')

    def attendee_count(self, object):
        return object.attendee_count
    attendee_count.short_description = _("Nombre de personnes inscrites")
    attendee_count.admin_order_field = 'attendee_count'

    def link(self, object):
        if object.pk:
            return format_html('<a href="{0}">{0}</a>', front_url('view_event', kwargs={'pk': object.pk}))
        else:
            return '-'
    link.short_description = _("Page sur le site")

    def get_queryset(self, request):
        qs = super().get_queryset(request)

        return qs.annotate(attendee_count=Sum(1 + F('rsvps__guests')))

    def get_urls(self):
        return [
            path('<uuid:pk>/add_organizer/', admin_site.admin_view(self.add_organizer), name="events_event_add_organizer")
        ] + super().get_urls()

    def add_organizer(self, request, pk):
        return views.add_member(self, request, pk)



@admin.register(models.Calendar, site=admin_site)
class CalendarAdmin(admin.ModelAdmin):
    fields = ('name', 'slug', 'link', 'user_contributed', 'description', 'image')
    list_display = ('name', 'slug', 'user_contributed')
    readonly_fields = ('link',)

    def link(self, object):
        if object.slug:
            return format_html('<a href="{0}">{0}</a>', front_url('view_calendar', kwargs={'slug': object.slug}))
        else:
            return '-'
    link.short_description = _("Lien vers l'agenda")


@admin.register(models.EventTag, site=admin_site)
class EventTagAdmin(admin.ModelAdmin):
    pass


@admin.register(models.EventSubtype, site=admin_site)
class EventSubtypeAdmin(admin.ModelAdmin):
    list_display = ('label', 'description', 'type')
    list_filter = ('type',)