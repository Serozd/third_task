import FundsModule from './funds';
import FundsController from './funds.controller';
import FundsComponent from './funds.component';
import FundsTemplate from './funds.html';

describe('Funds', () => {
  let $rootScope, makeController;

  beforeEach(window.module(FundsModule));
  beforeEach(inject((_$rootScope_) => {
    $rootScope = _$rootScope_;
    makeController = () => {
      return new FundsController();
    };
  }));

  describe('Module', () => {
    // top-level specs: i.e., routes, injection, naming
  });

  describe('Controller', () => {
    // controller specs
    it('has a name property [REMOVE]', () => { // erase if removing this.name from the controller
      let controller = makeController();
      expect(controller).to.have.property('name');
    });
  });

  describe('Template', () => {
    // template specs
    // tip: use regex to ensure correct bindings are used e.g., {{  }}
    it('has name in template [REMOVE]', () => {
      expect(FundsTemplate).to.match(/{{\s?\$ctrl\.name\s?}}/g);
    });
  });

  describe('Component', () => {
    // component/directive specs
    let component = FundsComponent;

    it('includes the intended template', () => {
      expect(component.template).to.equal(FundsTemplate);
    });

    it('invokes the right controller', () => {
      expect(component.controller).to.equal(FundsController);
    });
  });
});
