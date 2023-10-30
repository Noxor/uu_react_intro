const loadJsonData = async (url, updateState) => {
    try {
        let response = await fetch(url);
        let responseContent = "";
        try {
            responseContent = await response.text();
            responseContent = JSON.parse(responseContent);
        } catch (error) {
            updateState({ state: "error", error: { reason: "Unexpected server response", text: responseContent } });
            return;
        }

        if (response.status >= 400) {
            updateState({ state: "error", error: responseContent });
        } else {
            updateState({ state: "success", data: responseContent });
        }
    } catch (error) {
        debugger;
        updateState({ state: "error", error: { reason: "Unexpected error", data: error } });
    }
}

export { loadJsonData };