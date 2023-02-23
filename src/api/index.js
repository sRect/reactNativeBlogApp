export async function getArticleList() {
  const [err, res] = await fetch('http://1.15.42.2:3000/api/article/list', {
    method: 'POST',
  })
    .then(data => data.json())
    .then(data => [null, data.data])
    .catch(e => [e, null]);

  return [err, res];
}
