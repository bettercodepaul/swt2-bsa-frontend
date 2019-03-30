# swt2-bsa-frontend
SWT2 - Bogenliga Application - Angular Oberfläche

## Quickstart

Run `npm ci` to install all dependencies.

Run `ng serve -o`  to open the application. 

## Resources

- Angular Tutorial: https://angular.io/tutorial 
- Bootstrap W3 Schools: https://www.w3schools.com/bootstrap4/default.asp 
- Bootstrap: https://getbootstrap.com/docs/4.1/components/
- Flexbox: http://grochtdreis.de/schulungen/html5days-2018-1/flexbox-praxis/index.html#/ 
- Redux: https://redux.js.org/basics 
- Icons: https://fontawesome.com/icons?d=gallery
- Testing: 
  - https://codecraft.tv/courses/angular/unit-testing/jasmine-and-karma/
  - https://jasmine.github.io/2.0/introduction.html
  - https://entwickler.de/online/javascript/angular-testing-579793020.html


## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

## Known problems

### @ngrx/store is missing after npm install

This is a known bug of the npm dependency: [Bug](https://github.com/ngrx/platform/issues/55)

Run `npm install` a second time to fix the problem. 
