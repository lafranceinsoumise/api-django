import introJs from "intro.js";
import "intro.js/introjs.css";
import onDOMReady from "@agir/lib/utils/onDOMReady";

const onLoad = function () {
  const steps = [];
  const elems = document.getElementsByClassName("help-dialog");

  for (let elem of elems) {
    steps.push(
      Object.assign(
        {
          element: elem.parentElement,
          intro: elem.innerHTML,
        },
        elem.dataset
      )
    );
  }

  const i = introJs();
  i.addSteps(steps);

  i.setOptions({
    nextLabel: "Suivant &rarr;",
    prevLabel: "&larr; Précédent",
    skipLabel: "Passer",
    doneLabel: "Terminé",
  });

  if (steps.length > 0) {
    const buttons = document.getElementsByClassName("help-button");
    for (let button of buttons) {
      button.addEventListener("click", showHelp);
      button.style.display = "inherit";
    }
  }

  function showHelp(e) {
    i.start();
    e.preventDefault();
  }
};

onDOMReady(onLoad);
