document.addEventListener("DOMContentLoaded", function () {
  const chartContainer = document.getElementById("chart-container");
  const chartCanvas = document.getElementById("chart");
    let chartInstance = null;

  const chartData = {
    1: [200, 150, 180],
    2: [50, 150, 100],
    3: [500, 300, 250],
    4: [0, 0, 0],
    5: [2000, 1000, 500],
  };

  const rowLabels = {
    1: "Выручка",
    2: "Наличные",
    3: "Кредитная карта",
    4: "Безнал",
    5: "Количество",
  };

  const tbody = document.querySelector('#data-table tbody');

  Object.keys(chartData).forEach(rowId => {
    const rowData = chartData[rowId];
    const rowLabel = rowLabels[rowId]; 


    const row = document.createElement('tr');
    row.setAttribute('data-id', rowId);


    const labelCell = document.createElement('td');
    labelCell.textContent = rowLabel;
    row.appendChild(labelCell);


    rowData.forEach(value => {
      const cell = document.createElement('td');
      cell.textContent = value;
      row.appendChild(cell);
    });


    tbody.appendChild(row);
  });

  function showChart(data, row) {
    console.log("Показать график с данными:", data);

    if (chartInstance) {
      chartInstance.destroy(); 
    }
 
    chartInstance = new Chart(chartCanvas, {
      type: "line",
      data: {
        labels: ["Текущий день", "Вчера", "Этот день недели"],
        datasets: [
          {
            label: "Данные",
            data: data,
            borderColor: "rgba(75, 192, 192, 1)",
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });

    const nextRow = row.nextElementSibling;
    if (nextRow) {

      row.parentNode.insertBefore(chartContainer, nextRow);
    } else {
 
      row.parentNode.appendChild(chartContainer);
    }

    chartContainer.style.display = "block"; 
  }

  const rows = document.querySelectorAll("#data-table tbody tr");
  rows.forEach((row) => {
    const cells = row.querySelectorAll("td");

    const current = parseFloat(cells[1].innerText); 
    const yesterday = parseFloat(cells[2].innerText);   

    if (yesterday === 0) {
      cells[2].style.backgroundColor = "lightblue";
      cells[2].innerHTML = `${yesterday} <span>0%</span>`;
    } else if (!isNaN(current) && !isNaN(yesterday)) {
      const percent = ((current - yesterday) / yesterday * 100).toFixed(2);
  
      cells[2].innerHTML = `${yesterday} <span>${percent}%</span>`;
      cells[2].style.backgroundColor = percent >= 0 ? "lightgreen" : "lightcoral"; 
    }
  }); 

  const tableRows = document.querySelectorAll("#data-table tbody tr");
  tableRows.forEach((row) => {
    row.addEventListener("click", function () {
      const rowId = row.getAttribute("data-id");
      if (chartData[rowId]) {
        showChart(chartData[rowId], row);
      } else {
        console.log("Данные для выбранного продукта не найдены.");
      }
    });
  });
});