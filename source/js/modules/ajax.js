(function () {
  const GET = 'GET';
  const container = document.getElementById('table');
  if (!container) {
    return;
  }
  const URL = container.dataset.url;

  const setup = function (onLoad, onError) {
    const xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.addEventListener('load', function () {
      switch (xhr.status) {
        case 200:
          onLoad(xhr.response);
          break;

        default:
          onError('Статус ответа: ' + xhr.status + ' ' + xhr.statusText);
      }
    });

    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });

    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });

    xhr.timeout = 10000;

    return xhr;
  };

  const load = function (onLoad, onError, data) {
    if (!data) {
      data = null;
    }
    const xhr = setup(onLoad, onError);

    xhr.open(GET, URL);
    xhr.send(data);

  };

  const state = JSON.parse(localStorage.getItem(`state`));

  const renderTable = function(data) {
    const tr = document.createElement('tr');
    const template = `
      <td>${data.id}</td>
      <td>${data.name}</td>
      <td>${data.year}</td>
      <td>
        <div>
          <span style="background-color: ${data.color}"></span>
          ${data.color}
        </div>
      </td>
      <td>${data.pantone_value}</td>
    `;

    tr.innerHTML = template.trim();

    if (container) {
      container.appendChild(tr);
    }

    if (state) {
      state.forEach(function(item, index, array) {
        var tds = container.querySelectorAll('td:nth-child(' + item + ')');

        tds.forEach(function(td) {
          td.classList.add('hidden');
        });
      });
    }
  };

  const successHandler = function (arrData) {
      let data = arrData['data'];
      data.forEach(function (item) {
        renderTable(item);
      });
  };

  const errorHandler = function (error) {
    console.log(error);
  };

  load(successHandler, errorHandler);
})();
