// Checks word validity by calling dictionary api to see if a value is returned
export default function validateFromDictAPI(word) {
    return fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
        .then(res => res.json())
        .then(data => data)
}