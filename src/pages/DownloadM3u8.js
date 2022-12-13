

import { useRef } from "react";
import { Parser } from 'm3u8-parser';
export default function Home(props) {
  const inputRef = useRef(null);
  const directInputRef = useRef(null);
  const downloadURI = (uri, folder) => {
    const link = document.createElement('a');
    link.href = uri;
    const filename = uri.substring(uri.lastIndexOf('/') + 1);
    link.setAttribute('download', `${folder}${filename}`);
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
  }
  const handleClick = async () => {
    const url = inputRef.current.value
    const playlist_url = url + '/playlist.m3u8'
    // downloadURI(playlist_url, '');

    let html = await (await fetch(playlist_url)).text();
    const parser = new Parser();
    parser.push(html);
    parser.end();

    const parsed_manifest = parser.manifest;
    let pls = parsed_manifest.playlists;
    let i = 0;

    let i_interval = setInterval(async () => {
      let element = pls[i];

      const uri = element.uri;
      // console.log('uri', uri);
      downloadURI(url + '/' + uri, uri + '/');

      let html2 = await (await fetch(url + '/' + uri)).text();
      const arr = html2.match(/video[\d]*.ts/g);
      const resolution = uri.substring(uri.lastIndexOf('/') + 1);

      let j = 0
      let this_interval = setInterval(function () {
        // console.log(url + '/' + uri.replace(resolution, '') + arr[j])
        downloadURI(url + '/' + uri.replace(resolution, '') + arr[j], uri.replace(resolution, '') + '/')
        j++;
        if (j > arr.length - 1)
          clearInterval(this_interval);
      }, 2000);
      i++;
      if (i > pls.length - 1)
        clearInterval(i_interval);
    }, 200000);
  }

  const handleDirectDownload = async () => {
    const url = directInputRef.current.value
    // downloadURI(playlist_url, '');
    // console.log('url', url);
    downloadURI(url, '');
  }

  return (
    <div>
      <div>
        <input type='text' ref={inputRef} placeholder='https://peanutdev.github.io/fc4caf9b-05df-47a0-8623-e608f80ffef9' />
        <button onClick={() => handleClick()}>M3u8 Download</button>
      </div>
      <div>
        <input type='text' ref={directInputRef} />
        <button onClick={() => handleDirectDownload()}>Direct Download</button>
      </div>
    </div>
  );
}
