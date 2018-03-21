import AcceptModule from './accept';
import AcceptController from './accept.controller';
import AcceptComponent from './accept.component';
import AcceptTemplate from './accept.html';

describe('Accept', () => {
  let $rootScope, makeController;

  beforeEach(window.module(AcceptModule));
  beforeEach(inject((_$rootScope_) => {
    $rootScope = _$rootScope_;
    makeController = () => {
      return new AcceptController();
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
      expect(AcceptTemplate).to.match(/{{\s?\$ctrl\.name\s?}}/g);
    });
  });

  describe('Component', () => {
    // component/directive specs
    let component = AcceptComponent;

    it('includes the intended template', () => {
      expect(component.template).to.equal(AcceptTemplate);
    });

    it('invokes the right controller', () => {
      expect(component.controller).to.equal(AcceptController);
    });
  });
});
