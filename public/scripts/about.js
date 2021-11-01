async function typeSentence(sentence, delay = 75) {
    const letters = sentence.split("");
    let i = 0;
    while(i < letters.length) {
        await waitForMs(delay);
        document.getElementById('sentence').append(letters[i]);
        i++
    }
    return;
    }

function waitForMs(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

typeSentence("Here's What We're About")

