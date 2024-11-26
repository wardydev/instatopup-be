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

const formatDateTimestamp = (dateString) => {
  const date = new Date(dateString)

  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()

  return `${day}/${month}/${year}`
}

function getIndonesianDayName(date) {
  const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']
  return days[date.getDay()]
}

function getYesterdayIndonesianDayName() {
  const today = new Date()
  // Mengatur tanggal menjadi satu hari sebelumnya
  today.setDate(today.getDate() - 1)
  return getIndonesianDayName(today)
}

function calculatePercentageIncrease(previousAmount, currentAmount) {
  if (previousAmount === 0) {
    return currentAmount > 0 ? 100 : 0 // Jika uang kemarin 0 dan sekarang ada uang, anggap peningkatannya 100%
  }
  const increase = currentAmount - previousAmount
  const percentageIncrease = (increase / previousAmount) * 100
  return percentageIncrease
}

function formattedInvoice(invoice) {
  // Ambil karakter pertama dan terakhir setelah "TRX-"
  const firstChar = invoice[4]
  const lastChar = invoice[invoice.length - 1]

  // Buat string dengan format "TRX-1**************3"
  const formatted = `TRX-${firstChar}${'*'.repeat(
    invoice.length - 6
  )}${lastChar}`

  return formatted
}

module.exports = {
  formatRupiah,
  formatDate,
  getIndonesianDayName,
  getYesterdayIndonesianDayName,
  calculatePercentageIncrease,
  formatDateTimestamp,
  formattedInvoice,
}
