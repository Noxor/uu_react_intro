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

const performMethod = async (url, payload, onSuccess, onError) => {
    try {
        const res = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        const data = await res.json();

        if (res.status !== 200) {
            if (typeof onError === 'function') {
                onError(data.errorMessage ?? "Unknown Error");
            }

        } else {
            if (typeof onSuccess === 'function') {
                onSuccess();
            }
        }
    } catch (error) {
        if (typeof onError === 'function') {
            onError("Unknown Error");
        }
    }
}

export { loadJsonData, performMethod };