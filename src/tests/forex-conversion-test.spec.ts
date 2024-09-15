import {test,expect} from '@playwright/test';
import { getForexData } from '../utils/api-util'
import { getStartDateByWeek,calculateAverageForex } from '../utils/helper-methods';
import Series from '../seriesNames';

const numberOfWeeks = 10;
const startDate = getStartDateByWeek(numberOfWeeks);
const endDate = new Date().toISOString().slice(0,10);

test('Verify when API is returning 200 response',async()=>{

    const response = await getForexData(Series.CanadianToAustralian,startDate,endDate);
    expect(response.status()).toBe(200);

})

test(`Conversion rate for the ${Series.CanadianToAustralian} `,async()=>{
    
    const seriesValue = Series.CanadianToAustralian
    //Fetch the Forex data from Observation API
    const response = await getForexData(seriesValue,startDate,endDate);
    
    // Parse JSON response
    const jsonResponse =  await response.json();

    // Validating the API Response
    expect(jsonResponse).toHaveProperty('observations');
    const observations = jsonResponse.observations;

    //Ensure we have some data before calculating the average
    expect(observations.length).toBeGreaterThan(0);

    //Calculate the average conversion rate
    const averageRate =  calculateAverageForex(observations,seriesValue);

    console.log(`The average rate for the last ${numberOfWeeks} week(s) is: ${averageRate}`);

    expect(averageRate).toBeGreaterThan(0);
})

test('Verify when Series Name is invalid',async()=>{

    const seriesValue = Series.InvalidName;
    const response = await getForexData(seriesValue,startDate,endDate);
    const jsonResponse = await response.json();

    //Validate the response and error message
    expect(response.status()).toBe(404);
    expect(jsonResponse.message).toBe(`Series ${seriesValue} not found.`);

})

test('Verify when Start Date is greater than End Date',async()=>{

    const seriesValue = Series.CanadianToAustralian;
    const response = await getForexData(seriesValue,endDate,startDate);
    const jsonResponse = await response.json();

    //Validate the response and error message
    expect(response.status()).toBe(400);
    expect(jsonResponse.message).toBe('The End date must be greater than the Start date.');

})