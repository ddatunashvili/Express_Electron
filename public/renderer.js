console.log('Electron API:', window.electron); // Debug log to confirm electron API is available

// Fetch available PDF resources from backend
fetch('http://localhost:3000/resources')
    .then(response => response.json())
    .then(data => {
        const pdfList = document.getElementById('pdfList');
        
        // Loop through PDF files from backend and add them to the list
        data.pdfFiles.forEach(pdf => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `<a href="#" onclick="openPDF('${pdf}')">${pdf}</a>`;
            pdfList.appendChild(listItem);
        });

        // Function to open PDF using Electron's shell API
        window.openPDF = function(fileName) {
            const pdfUrl = `http://localhost:3000/resources/${fileName}`;
            if (window.electron && window.electron.openExternal) {
                window.electron.openExternal(pdfUrl); // Open PDF in external browser
            } else {
                console.error('Electron API not available.');
            }
        };
    })
    .catch(error => console.error('Error fetching resources:', error));
