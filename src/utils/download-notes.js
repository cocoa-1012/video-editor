export const handleDownloadNotes = (project_title, html_script) => {
    if (project_title === '') {
        alert('Sorry, project title is empty.');
        return false;
    }
    if (html_script === '') {
        alert('Sorry, markdown text is empty.');
        return false;
    }

    // Create blob link to download
    const url = window.URL.createObjectURL(new Blob([html_script]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${project_title}.html`);

    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
};