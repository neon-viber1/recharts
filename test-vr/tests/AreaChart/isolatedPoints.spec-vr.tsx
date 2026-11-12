import { expect, testWithThemes } from '../fixtures';

testWithThemes('AreaChart with isolated points between nulls', async ({ mountStory }) => {
  const component = await mountStory('AreaChart/isolatedPoints/AreaChartWithNullGaps');
  await expect(component).toHaveScreenshot('AreaChart-isolatedPoints-nullGaps.png');
});

testWithThemes('AreaChart with a single data point', async ({ mountStory }) => {
  const component = await mountStory('AreaChart/isolatedPoints/AreaChartWithSingleDatum');
  await expect(component).toHaveScreenshot('AreaChart-isolatedPoints-singleDatum.png');
});
