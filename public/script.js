async function solveParajumble() {
  const input = document.getElementById("inputText").value;
  const resultDiv = document.getElementById("result");
  resultDiv.innerHTML = "⏳ Processing...";

  const response = await fetch("https://api-inference.huggingface.co/models/facebook/bart-large-cnn", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ inputs: input })
  });

  if (!response.ok) {
    resultDiv.innerHTML = "❌ Error from HuggingFace API. Try again later.";
    return;
  }

  const data = await response.json();
  if (data.error) {
    resultDiv.innerHTML = `❌ API Error: ${data.error}`;
    return;
  }

  const outputText = data[0]?.summary_text || "❌ Couldn't generate summary.";
  resultDiv.innerHTML = `<p>${outputText}</p>`;
}
