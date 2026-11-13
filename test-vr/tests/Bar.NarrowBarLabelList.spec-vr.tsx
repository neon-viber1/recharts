import { expect, testWithThemes } from './fixtures';

testWithThemes('Narrow bars with LabelList at the top', async ({ mountStory }) => {
  const component = await mountStory('Bar.NarrowBarLabelList/LabelListTop');
  await expect(component).toHaveScreenshot();
});

testWithThemes('Narrow bars with LabelList at the inside bottom', async ({ mountStory }) => {
  const component = await mountStory('Bar.NarrowBarLabelList/LabelListInsideBottom');
  await expect(component).toHaveScreenshot();
});
