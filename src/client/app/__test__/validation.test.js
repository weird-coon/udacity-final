import { validate } from '../validation';

describe('formInputValidation', () => {
  test('Should return required messsage when the form is empty', () => {
    const mockFormData = { location: '', start: 'test', end: 'test' };
    const mockFormError = validate(mockFormData);
    expect(mockFormError).toEqual(
      'Trip info cannot be blank. Please try again.',
    );
  });

  test('Should return invalid date messsage', () => {
    const mockFormData = {
      location: 'test',
      start: '2022-08-11',
      end: '2022-08-08',
    };
    const mockFormError = validate(mockFormData);
    expect(mockFormError).toEqual(
      'Please enter valid date\nCheck your start date / end date then try again',
    );
  });

  test('Should pass validation when form data is valid', () => {
    const mockFormData = {
      location: 'test',
      start: '2022-08-11',
      end: '2022-08-20',
    };
    const mockFormError = validate(mockFormData);
    expect(mockFormError).toBe(false);
  });
});
