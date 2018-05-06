const Input = {
    _keyboard: typeof THREEx === 'undefined' ? null :new THREEx.KeyboardState()
};

Input.getKey = function (key) {
    return Input._keyboard.pressed(key);
};

module.exports = Input;
