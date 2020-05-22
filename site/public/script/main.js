(async function(w, d) {

  const baseURL = 'http://localhost:8001/api';
  const history = [];

  async function request(url) {
    const response = await fetch(url, {
      method: 'GET',
      mode: 'cors',
      cache: 'no-cache',
    });
    return response.json();
  }

  function getElementMap() {
    return [
      'xchgr8_from',
      'xchgr8_to',
      'xchgr8_value',
      'xchgr8_result',
      'xchgr8_button',
      'xchgr8_history',
    ].reduce((map, item) => {
      map[item] = d.getElementById(item);
      return map;
    }, Object.create(null));
  }

  async function initFields(em) {
    const currencies = await request(`${baseURL}/currencies`);
    [
      [em.xchgr8_from, 'USD'],
      [em.xchgr8_to, 'EUR']
    ].forEach(([field, selected]) => {
      while(field.firstChild !== null) {
        field.removeChild(field.lastChild);
      }
      currencies.symbols.forEach(symbol => {
        const isSelected = selected === symbol;
        field.add(new Option(symbol, symbol, isSelected, isSelected));
      });
    });
  }

  function fmt(num) {
    return num.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
  }

  function updateHistory(el, history) {
    const lines = [];
    history.forEach(item => {
      const {
        from,
        rate,
        to,
        value,
        conversion
      } = item;
      lines.push(`${from} ${fmt(value)} => ${to} ${fmt(conversion)} (${rate.toFixed(3)})`);
    });
    el.value = lines.join('\n');
  }

  async function initButton(em) {
    const {
      xchgr8_button,
      xchgr8_from,
      xchgr8_to,
      xchgr8_value,
      xchgr8_result,
      xchgr8_history
    } = em;
    xchgr8_button.addEventListener('click', async function handler(e) {
      try {
        const from = xchgr8_from.value;
        const to = xchgr8_to.value;
        const value = xchgr8_value.value;
        xchgr8_button.disabled = true;
        const response = await request(`${baseURL}/convert/${value}/${from}/${to}`);
        if (!response || typeof response.conversion !== 'number') {
          throw new Error('Invalid Response');
        }
        if (history.unshift(response) > 10) {
          history.pop();
        }
        updateHistory(xchgr8_history, history);
        xchgr8_result.value = fmt(response.conversion);
      } catch (e) {
        console.error('Something went wrong...', e.message);
      }
      xchgr8_button.disabled = false;
    });
    xchgr8_button.disabled = false;
  }

  const eMap = getElementMap();
  await initFields(eMap);
  await initButton(eMap);

}(window, window.document));
