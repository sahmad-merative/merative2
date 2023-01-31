import { getMetadata, createTag } from '../../scripts/scripts.js';
import { fetchPlaceholders } from '../../scripts/lib-franklin.js';

export default async function decorate(block) {
  const docUrl = getMetadata('document-link');
  if (docUrl) {
    const script = document.createElement('script');
    script.src = 'https://documentservices.adobe.com/view-sdk/viewer.js';

    const docFilename = docUrl.split('/').pop();
    const docDiv = createTag('div', { id: 'adobe-dc-view' });
    const placeholders = await fetchPlaceholders();

    block.textContent = '';
    block.append(script);
    block.append(docDiv);

    let pdfAPIKey;
    if (window.location.host.endsWith('.page') || window.location.host.startsWith('localhost')) {
      pdfAPIKey = placeholders.pdfapikeypage;
    } else if (window.location.host.endsWith('.live')) {
      pdfAPIKey = placeholders.pdfapikeylive;
    } else if (window.location.host.endsWith('merative.com')) {
      pdfAPIKey = placeholders.pdfapikey;
    }

    if (pdfAPIKey) {
      document.addEventListener('adobe_dc_view_sdk.ready', () => {
        // eslint-disable-next-line no-undef
        const adobeDCView = new AdobeDC.View({ clientId: pdfAPIKey, divId: 'adobe-dc-view' });
        if (adobeDCView) {
          // eslint-disable-next-line no-undef
          adobeDCView.previewFile({
            content: { location: { url: docUrl } },
            metaData: { fileName: docFilename },
          });
        }
      });
    }
  }
}
