// Единственное место, где настраивается воркер pdf.js.
// Раньше это жило внутри PdfViewer, и любой другой потребитель pdfjs
// работал только потому, что PdfViewer случайно импортировался раньше.
import * as pdfjs from 'pdfjs-dist'
import pdfWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url'

pdfjs.GlobalWorkerOptions.workerSrc = pdfWorker

export default pdfjs
