// grading-calculator.js
const gradeSelect = document.getElementById("highest-grade");
const currentGradeDateField = document.getElementById("current-grade-date");
const currentGradeDateInput = document.getElementById("current-grade-date-input");
const earliestDateP = document.getElementById("earliest-date");
const nextEventP = document.getElementById("next-event");
const eventsTable = document.getElementById("events-table");

let loadedEvents = [];

const gradeOrder = ["ungraded", "ikkyu", "shodan", "nidan", "sandan", "yondan", "godan", "rokudan", "nanadan", "hachidan"];
const gradeRequirements = {
  ikkyu: { offset: { months: 6 } },
  shodan: { offset: { months: 3 } },
  nidan: { offset: { years: 1 } },
  sandan: { offset: { years: 2 } },
  yondan: { offset: { years: 3 } },
  godan: { offset: { years: 4 } },
  rokudan: { offset: { years: 5 } },
  nanadan: { offset: { years: 6 } },
  hachidan: { offset: { years: 10 } }
};

function addTime(date, offset) {
  const d = new Date(date);
  if (offset.months) d.setMonth(d.getMonth() + offset.months);
  if (offset.years) d.setFullYear(d.getFullYear() + offset.years);
  return d;
}

function updateEligibility() {
  const grade = gradeSelect.value;
  const currentDate = currentGradeDateInput.valueAsDate;

  if (!grade || !currentDate) {
    earliestDateP.textContent = "Select your highest grade to see your next eligible date.";
    nextEventP.textContent = "Matching event will be shown here if available.";
    loadedEvents.forEach(e => e.rowElement?.classList.remove("highlight"));
    return;
  }

  const currentIndex = gradeOrder.indexOf(grade);
  const nextGrade = gradeOrder[currentIndex + 1];

  if (!nextGrade) {
    earliestDateP.innerHTML = "There are no more gradings available to you. You have successfully completed Kendo.";
    nextEventP.innerHTML = "";
    loadedEvents.forEach(e => e.rowElement?.classList.remove("highlight"));
    return;
  }

  const nextReq = gradeRequirements[nextGrade];
  let eligibleDate = addTime(currentDate, nextReq?.offset || {});

  const eligibleStr = eligibleDate.toISOString().split('T')[0];
  const capitalizedNextGrade = nextGrade.charAt(0).toUpperCase() + nextGrade.slice(1);

  earliestDateP.innerHTML = `Earliest possible grading date for <strong>${capitalizedNextGrade}</strong>: <strong>${eligibleStr}</strong>`;

  loadedEvents.forEach(e => e.rowElement?.classList.remove("highlight"));

  const nextEvent = loadedEvents.find(event => {
    const eventMaxIndex = gradeOrder.indexOf(event.level);
    const nextIndex = gradeOrder.indexOf(nextGrade);
    return eventMaxIndex >= nextIndex && event.date >= eligibleDate;
  });

  if (nextEvent) {
    nextEventP.innerHTML = `Next viable event: <strong>${nextEvent.name}</strong> on <strong>${nextEvent.date.toISOString().split('T')[0]}</strong>`;
    nextEvent.rowElement?.classList.add("highlight");
  } else {
    nextEventP.innerHTML = `<em>No upcoming grading events found after your eligibility date.</em>`;
  }

  const futureGradesHTML = [];
  let projectedDate = new Date(eligibleDate);

  for (let i = currentIndex + 2; i <= currentIndex + 3 && i < gradeOrder.length; i++) {
    const gradeName = gradeOrder[i];
    const req = gradeRequirements[gradeName];
    if (!req) break;

    projectedDate = addTime(nextEvent.date, req.offset);
    const dateStr = projectedDate.toISOString().split('T')[0];
    futureGradesHTML.push(`<strong>${gradeName.charAt(0).toUpperCase() + gradeName.slice(1)}</strong>: ${dateStr}`);
  }

  if (futureGradesHTML.length > 0) {
    nextEventP.innerHTML += `<br><br>If you pass, you would be eligible for:<br>${futureGradesHTML.join('<br>')}`;
  }
}

function loadCSVEvents() {
  Papa.parse("bka_grading_events.csv", {
    download: true,
    header: true,
    complete: function(results) {
      eventsTable.innerHTML = "";
      loadedEvents = results.data
        .filter(row => row["Event Name"] && row["Date"] && row["Grading Level"])
        .map(row => {
          const tr = document.createElement("tr");
          tr.innerHTML = `
            <td>${row["Event Name"]}</td>
            <td>${row["Date"]}</td>
            <td>${row["Grading Level"]}</td>
            <td><a href="${row["URL"]}" target="_blank">View</a></td>
          `;
          eventsTable.appendChild(tr);
          return {
            name: row["Event Name"],
            date: new Date(row["Date"]),
            level: row["Grading Level"].toLowerCase().trim(),
            url: row["URL"],
            rowElement: tr
          };
        });
      updateEligibility();
    }
  });
}

gradeSelect.addEventListener("change", () => {
  currentGradeDateField.style.display = gradeSelect.value ? "block" : "none";
  if (!gradeSelect.value) currentGradeDateInput.value = "";
  updateEligibility();
});

currentGradeDateInput.addEventListener("change", updateEligibility);

loadCSVEvents();
