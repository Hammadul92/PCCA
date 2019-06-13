from xhtml2pdf import pisa
from cStringIO import StringIO

def create_pdf(sourceHtml, outputFilename, INVOICE_FILES_DEST):
    # open output file for writing (truncated binary)
    
    resultFile = open(INVOICE_FILES_DEST+outputFilename, "w+b")	
    # convert HTML to PDF
    pisaStatus = pisa.CreatePDF(
            StringIO(sourceHtml.encode('utf-8')),                # the HTML to convert
            dest=  resultFile)           # file handle to recieve result

    # close output file
    resultFile.close()                 # close output file

    # return True on success and False on errors
    return pisaStatus.err


   

