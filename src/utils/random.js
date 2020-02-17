exports.id = () => {

    let _src = 'abcdefghijklmnopqrstuvwxyz1234567890';
    let randomId = '';

    while (randomId.length < _src.length) {
        randomId += _src[parseInt(Math.random() * _src.length)];
    }

    return randomId;
};