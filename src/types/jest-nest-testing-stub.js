// Minimal runtime stub for @nestjs/testing used in some specs.
// This allows Jest to resolve imports without installing Nest packages.

class TestingModule {
  get(token) {
    return null;
  }
}

const Test = {
  createTestingModule() {
    return {
      compile: async () => new TestingModule(),
    };
  },
};

module.exports = {
  Test,
  TestingModule,
};