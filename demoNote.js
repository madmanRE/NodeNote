const demoNote = {
  title: "Demo",
  text: `
<style>
  table {
    border-collapse: collapse;
    width: 100%;
  }

  th, td {
    border: 1px solid black;
    padding: 8px;
    text-align: left;
  }

  th {
    background-color: #f2f2f2;
  }
</style>

<table>
  <thead>
    <tr>
      <th>Отображаемое</th>
      <th>Код разметки</th>
      <th>Примечания</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><h1>Заголовок 1</h1></td>
      <td># Заголовок 1</td>
      <td>Заголовки должны начинаться с новой строки</td>
    </tr>
    <tr>
      <td><h2>Заголовок 2</h2></td>
      <td>## Заголовок 2</td>
      <td>Они также занимают очень много места в окне</td>
    </tr>
    <tr>
      <td><h3>Заголовок 3</h3></td>
      <td>### Заголовок 3</td>
      <td></td>
    </tr>
    <tr>
      <td><h4>Заголовок 4</h4></td>
      <td>#### Заголовок 4</td>
      <td>Самый маленький заголовок – 6 знаков #</td>
    </tr>
    <tr>
      <td><em>Текст курсивом</em></td>
      <td>*Текст курсивом*</td>
      <td></td>
    </tr>
    <tr>
      <td>_Текст курсивом_</td>
      <td>_ можно заменить на *</td>
      <td></td>
    </tr>
    <tr>
      <td><b>Жирный текст</b></td>
      <td>**Жирный текст**</td>
      <td></td>
    </tr>
    <tr>
      <td>Зачеркнутый текст</td>
      <td>~~Зачеркнутый текст~~</td>
      <td></td>
    </tr>
    <tr>
      <td>Жирный текст курсивом</td>
      <td>***Жирный текст курсивом***</td>
      <td></td>
    </tr>
    <tr>
      <td>_Не курсив_</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <td>#Не заголовок#</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <td>**Не жирный**</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <td>\_Не курсив\_</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <td>\#Не заголовок\#</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <td>\*\*Не жирный\*\*</td>
      <td></td>
      <td></td>
    </tr>
  </tbody>
</table>

  `,
};

module.exports = demoNote;