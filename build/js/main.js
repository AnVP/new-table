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
(function () {
  const btnReset = document.querySelector('.js-btn-reset');
  const container = document.querySelector('.table');
  if (!container) {
    return;
  }

  const state = {
    value: [],
    btn: 'disabled'
  }

  let storageDate = JSON.parse(localStorage.getItem(`state`));
  let storageBtn = JSON.parse(localStorage.getItem(`btn`));

  if (storageDate) {
    state.value = storageDate;
  }

  if (storageBtn) {
    state.btn = storageBtn;
  }

  const checkboxs = container.querySelectorAll('input[type="checkbox"]');
  if (!checkboxs.length) {
    return;
  }

  checkboxs.forEach(function(checkbox) {
    checkbox.addEventListener('change', function() {
      var value = checkbox.value;
      state.value.push(value);
      var items = container.querySelectorAll('td:nth-child(' + value + ')');

      checkbox.checked = false;
      items.forEach(function(item) {
        item.classList.add('hidden');
      });

      var ths = container.querySelectorAll('th:nth-child(' + value + ')');

      ths.forEach(function(item) {
        item.classList.add('hidden');
      });

      if (btnReset) {
        btnReset.removeAttribute('disabled');
        state.btn = false;
      }

      localStorage.setItem('state', JSON.stringify(state.value));
      localStorage.setItem('btn', JSON.stringify(state.btn));
      localStorage.setItem('class', JSON.stringify('hidden'));
    });
  })

  if (btnReset) {
    btnReset.addEventListener('click', function (evt) {
      evt.preventDefault();
      var hiddens = document.querySelectorAll('.hidden');
      hiddens.forEach(function (item) {
        item.classList.remove('hidden');
      });
      checkboxs.forEach(function(checkbox) {
        checkbox.checked = true;
      });
      btnReset.setAttribute('disabled', 'disabled');
      state.value = [];
      state.btn = 'disabled';
      localStorage.setItem('state', JSON.stringify(state.value));
      localStorage.setItem('class', JSON.stringify(''));
      localStorage.setItem('btn', JSON.stringify(state.btn));
    })
  }

  const tableRender = () => {
    const data = JSON.parse(localStorage.getItem(`state`));

    if (data) {
      data.forEach(function(item, index, array) {
        checkboxs.forEach(function(checkbox) {
          if(checkbox.value === item) {
            checkbox.checked = false;

            var ths = container.querySelectorAll('th:nth-child(' + item + ')');
            ths.forEach(function(th) {
              th.classList.add('hidden');
            });
          }
        });
      });
    }
  };
  tableRender();

  const btnRender = () => {
    const data = JSON.parse(localStorage.getItem(`btn`));

    if (data) {
       btnReset.setAttribute('disabled', 'disabled');
    } else {
      btnReset.removeAttribute('disabled');
    }
  };

  btnRender();
})();