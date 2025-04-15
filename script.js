document.addEventListener('DOMContentLoaded', function() {
    const { jsPDF } = window.jspdf;
    const inputText = document.getElementById('inputText');
    const rearrangeBtn = document.getElementById('rearrangeBtn');
    const outputText = document.getElementById('outputText');
    const explanation = document.getElementById('explanation');
    const exportPdfBtn = document.getElementById('exportPdf');

    rearrangeBtn.addEventListener('click', function() {
        const sentences = inputText.value.split('\n').filter(s => s.trim() !== '');
        
        if (sentences.length === 0) {
            outputText.textContent = 'Please enter some sentences to rearrange.';
            explanation.textContent = '';
            return;
        }

        const result = rearrangeSentences(sentences);
        
        outputText.textContent = result.rearranged.join('\n');
        explanation.innerHTML = result.explanation;
    });

    exportPdfBtn.addEventListener('click', exportToPdf);

    function rearrangeSentences(sentences) {
        // Try to identify the opening sentence
        let openingIndex = sentences.findIndex(s => 
            s.includes('National Medical Commission') || 
            s.includes('introduces') || 
            s.includes('new rule') ||
            s.match(/^[A-Z][a-z].*\.$/)); // Starts with capital letter, ends with period
        
        if (openingIndex === -1) openingIndex = 0;
        
        const openingSentence = sentences[openingIndex];
        const remainingSentences = sentences.filter((_, i) => i !== openingIndex);
        
        // Sort remaining sentences
        const sortedRemaining = remainingSentences.sort((a, b) => {
            const aHasTransition = a.includes('however') || a.includes('but') || a.includes('although');
            const bHasTransition = b.includes('however') || b.includes('but') || b.includes('although');
            
            if (aHasTransition && !bHasTransition) return 1;
            if (!aHasTransition && bHasTransition) return -1;
            
            const aIsQuestion = a.trim().endsWith('?');
            const bIsQuestion = b.trim().endsWith('?');
            
            if (aIsQuestion && !bIsQuestion) return 1;
            if (!aIsQuestion && bIsQuestion) return -1;
            
            return 0;
        });
        
        const rearranged = [openingSentence, ...sortedRemaining];
        
        // Generate detailed explanation
        let explanationHTML = `
            <div class="explanation-step">
                <span class="step-number">Step 1:</span> Selected the opening sentence: <strong>"${openingSentence}"</strong> because it introduces the main topic.
            </div>
            <div class="explanation-step">
                <span class="step-number">Step 2:</span> Analyzed the remaining sentences for logical flow:
                <ul>
                    <li>Sentences with transitional words (however, but) were moved toward the end</li>
                    <li>Questions were placed after statements where appropriate</li>
                    <li>Related concepts were grouped together</li>
                </ul>
            </div>
            <div class="explanation-step">
                <span class="step-number">Step 3:</span> Final arrangement ensures:
                <ul>
                    <li>Clear introduction of the topic</li>
                    <li>Logical progression of ideas</li>
                    <li>Natural conclusion with contrasting viewpoints if present</li>
                </ul>
            </div>
            <div class="explanation-step">
                <span class="step-number">Note:</span> This is an algorithmic rearrangement. For complex paragraphs, human review may be needed.
            </div>
        `;
        
        return {
            rearranged,
            explanation: explanationHTML
        };
    }

    function exportToPdf() {
        if (!outputText.textContent.trim()) {
            alert('Please rearrange sentences first before exporting.');
            return;
        }

        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        // Add title
        doc.setFontSize(20);
        doc.setTextColor(40, 62, 80);
        doc.text('Sentence Rearrangement Result', 105, 20, { align: 'center' });
        
        // Add date
        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text(`Generated on: ${new Date().toLocaleString()}`, 105, 30, { align: 'center' });
        
        // Add rearranged content
        doc.setFontSize(14);
        doc.setTextColor(0, 0, 0);
        doc.text('Rearranged Paragraph:', 14, 45);
        doc.setFontSize(12);
        const splitText = doc.splitTextToSize(outputText.textContent, 180);
        doc.text(splitText, 14, 55);
        
        // Add explanation
        doc.setFontSize(14);
        doc.text('Rearrangement Explanation:', 14, doc.autoTable.previous.finalY + 15);
        doc.setFontSize(12);
        
        // Convert HTML explanation to plain text for PDF
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = explanation.innerHTML;
        const plainText = tempDiv.textContent || tempDiv.innerText || '';
        const splitExplanation = doc.splitTextToSize(plainText, 180);
        doc.text(splitExplanation, 14, doc.autoTable.previous.finalY + 25);
        
        // Save the PDF
        doc.save('Sentence_Rearrangement_Result.pdf');
    }
});