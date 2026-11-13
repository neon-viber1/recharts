import { expect, testWithThemes } from './fixtures';

testWithThemes('Y axes on the same side follow element order: abc first', async ({ mountStory }) => {
  const component = await mountStory('YAxis.order/AlphabeticalOrder');
  await expect(component).toHaveScreenshot();
});

testWithThemes('Y axes on the same side follow element order: def first', async ({ mountStory }) => {
  const component = await mountStory('YAxis.order/ReverseAlphabeticalOrder');
  await expect(component).toHaveScreenshot();
});
