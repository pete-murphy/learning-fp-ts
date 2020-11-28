const invoices = [
  { id: 1, amount: "2" },
  { id: 2, amount: "5" },
  { id: 3, amount: "10" },
  { id: 4, amount: "3" },
]

const paidInvoices = [
  { id: 1, invoiceId: 1, date: "09-09-2020" },
  { id: 2, invoiceId: 3, date: "10-09-2020" },
]

/**
 * Goal result invoices with paid status
 * [
 *      {id: 1, amount: '2', paid:true },
 *      {id: 1, amount: '5', paid:false },
 *      {id: 1, amount: '10', paid:true },
 *      {id: 1, amount: '3', paid:false },
 * ]
 */

// for (let invoice of invoices) {
//   for (let paidInvoice of paidInvoices) {
//     if (invoice.id === paidInvoice.invoiceId) {
//       invoice.paid = true
//     }
//   }
// }

/**
 * Achived Result and mutates invoice
 * [
 *      { "id": 1, "amount": "2", "paid": true },
 *      { "id": 2, "amount": "5" },
 *      { "id": 3, "amount": "10", "paid": true },
 *      { "id": 4, "amount": "3" }
 * ]
 */

// invoices.map(invoice => {
//   paidInvoices.map(paidInvoice => {
//     if (invoice.id === paidInvoice.invoiceId) {
//       invoice.paid = true
//     }
//     return invoice
//   })
// })

const result = invoices.reduce(
  (updatedInvoices, invoice) =>
    updatedInvoices.push({
      ...invoice,
      paid: paidInvoices.some(
        paidInvoice => paidInvoice.invoiceId === invoice.id
      ),
    }) && updatedInvoices,
  []
)

result

/**
 * Result Same as for...of
 */
