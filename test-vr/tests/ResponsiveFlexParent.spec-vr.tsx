import { expect, testWithThemes } from './fixtures';

testWithThemes('responsive chart fills the growing content area of a flex column', async ({ mountStory }) => {
  const component = await mountStory('ResponsiveFlexParent/ResponsiveInFlexColumn');
  await expect(component).toHaveScreenshot();
});
