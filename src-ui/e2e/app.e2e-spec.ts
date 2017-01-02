import { MusicStreamClientPage } from './app.po';

describe('music-stream-client App', function() {
  let page: MusicStreamClientPage;

  beforeEach(() => {
    page = new MusicStreamClientPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
