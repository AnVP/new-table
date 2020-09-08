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
