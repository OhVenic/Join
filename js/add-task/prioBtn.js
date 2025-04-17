let selectedPrio;

function selectPrio(prio) {
  const prios = ["urgent", "medium", "low"];
  prios.forEach((p) => unselectPrio(p));
  document.getElementById(`prio-img-${prio}`).src = `./assets/icons/priority-${prio}-white.svg`;
  document.getElementById(`prio-btn-${prio}`).style.backgroundColor = getPrioColor(prio);
  document.getElementById(`prio-btn-${prio}`).style.color = "white";
  selectedPrio = `${prio}`;
}

function unselectPrio(prio) {
  document.getElementById(`prio-img-${prio}`).src = `./assets/icons/priority-${prio}.svg`;
  document.getElementById(`prio-btn-${prio}`).style.backgroundColor = "white";
  document.getElementById(`prio-btn-${prio}`).style.color = "black";
  selectedPrio = "";
}

function togglePrio(prio) {
  if (document.getElementById(`prio-btn-${prio}`).style.color === "white") {
    unselectPrio(prio);
  } else {
    selectPrio(prio);
  }
}

function getPrioColor(prio) {
  switch (prio) {
    case "urgent":
      return "#FF3D00";
    case "medium":
      return "#FFA800";
    case "low":
      return "#7AE229";
    default:
      return "white";
  }
}
