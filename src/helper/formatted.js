const formatRupiah = (amount) => {
  return (
    'Rp ' +
    Number(amount)
      .toLocaleString('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
      })
      .replace('IDR', '')
      .trim()
  )
}

const formatDate = (dateString) => {
  const date = new Date(dateString)

  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()

  return `${day}/${month}/${year}`
}

module.exports = {
  formatRupiah,
  formatDate,
}
