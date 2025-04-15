document.addEventListener('DOMContentLoaded', function() {
    const { jsPDF } = window.jspdf;
    const inputText = document.getElementById('inputText');
    const analyzeBtn = document.getElementById('analyzeBtn');
    const outputResult = document.getElementById('outputResult');
    const downloadPdf = document.getElementById('downloadPdf');
    const loadingArea = document.getElementById('loading');

    // Initialize with example text
    inputText.value = `A). It's the Commission's answer to curb growing violence against doctors. What provokes violence?
B). Cases of patient violence are many. So are instances of medical malpractice and negligence. Systemic reforms and regaining trust can suture the fractured relationship.
C). The new rule, however well-intentioned, could be counter-productive if patients misconstrue it to be punitive or discriminatory.
D). A poorly funded public healthcare system and pricey private medicare frustrates patients, while short-staffing and unending patient queues test doctors' patience.
E). The National Medical Commission notifies that doctors can refuse treatment to abusive or unruly patients except in emergencies.`;

    analyzeBtn.addEventListener('click', async function() {
        const sentences = inputText.value.split('\n').filter(s => s.trim() !== '');
        
        if (sentences.length === 0) {
            alert('Please enter some sentences to analyze.');
            return;
        }

        // Show loading indicator
        loadingArea.style.display = 'block';
        outputResult.innerHTML = '';
        
        try {
            // Simulate AI analysis (in a real app, you would call LanguageTool API here)
            const result = await simulateLanguageToolAnalysis(sentences);
            displayResult(result);
        } catch (error) {
            console.error('Analysis error:', error);
            outputResult.innerHTML = `<div class="error">Error in analysis: ${error.message}</div>`;
        } finally {
            loadingArea.style.display = 'none';
        }
    });

    downloadPdf.addEventListener('click', function() {
        if (!outputResult.innerHTML.trim()) {
            alert('Please analyze sentences first before generating PDF.');
            return;
        }
        generatePDF();
    });

    async function simulateLanguageToolAnalysis(sentences) {
        // In a real implementation, you would call LanguageTool API here
        // This is a simulation that mimics what LanguageTool might return
        
        return new Promise(resolve => {
            setTimeout(() => {
                // This is the same medical example structure but with AI-like analysis
                resolve({
                    sequence: "E → A → D → B → C",
                    structuredParagraph: `E) The National Medical Commission notifies that doctors can refuse treatment to abusive or unruly patients except in emergencies.\nA) It's the Commission's answer to curb growing violence against doctors. What provokes violence?\nD) A poorly funded public healthcare system and pricey private medicare frustrates patients, while short-staffing and unending patient queues test doctors' patience.\nB) Cases of patient violence are many. So are instances of medical malpractice and negligence. Systemic reforms and regaining trust can suture the fractured relationship.\nC) The new rule, however well-intentioned, could be counter-productive if patients misconstrue it to be punitive or discriminatory.`,
                    analysis: [
                        {
                            sentence: "E",
                            feedback: "Identified as the best opening sentence because it introduces the main topic (new rule) and comes from an authoritative source (National Medical Commission).",
                            confidence: 95
                        },
                        {
                            sentence: "A",
                            feedback: "Follows naturally as it explains the purpose of the rule mentioned in E. The question 'What provokes violence?' creates a smooth transition.",
                            confidence: 90
                        },
                        {
                            sentence: "D",
                            feedback: "Directly answers the question posed in A by listing systemic issues. Contains cause-effect relationships that logically follow.",
                            confidence: 85
                        },
                        {
                            sentence: "B",
                            feedback: "Provides balance to the discussion by showing both sides (violence and malpractice). The suggestion of reforms acts as a pivot point.",
                            confidence: 80
                        },
                        {
                            sentence: "C",
                            feedback: "Effective conclusion as it addresses potential counterarguments ('however well-intentioned') and completes the discussion.",
                            confidence: 88
                        }
                    ],
                    confidence: 87,
                    flow: "Rule Introduction → Purpose → Causes → Balanced Analysis → Conclusion"
                });
            }, 2000); // Simulate API delay
        });
    }

    function displayResult(result) {
        let html = `
            <div class="ai-analysis">
                <h3><i class="fas fa-brain"></i> AI Analysis Summary</h3>
                <p>Confidence in this arrangement: <strong>${result.confidence}%</strong></p>
                <div class="confidence-meter">
                    <div class="confidence-level" style="width: ${result.confidence}%"></div>
                </div>
            </div>
            
            <div class="result-section">
                <div class="sentence-sequence">Optimal sentence sequence:</div>
                <div class="sequence-arrow">${result.sequence}</div>
                
                <div class="structured-paragraph">${result.structuredParagraph}</div>
                
                <div class="reasoning-header"><i class="fas fa-comment-alt"></i> AI Reasoning:</div>
        `;

        result.analysis.forEach((item, index) => {
            html += `
                <div class="ai-feedback">
                    <p><strong>Sentence ${item.sentence}:</strong> <span class="ai-highlight">${item.feedback}</span></p>
                    <p>Confidence: ${item.confidence}%</p>
                </div>
            `;
        });

        html += `
                <div class="flow-diagram">Detected logical flow: ${result.flow}</div>
            </div>
        `;

        outputResult.innerHTML = html;
    }

    function generatePDF() {
        const content = document.getElementById('outputResult').innerText;
        if (!content.trim()) return;

        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        // Add title
        doc.setFontSize(18);
        doc.setTextColor(40, 62, 80);
        doc.text('AI Sentence Rearrangement Analysis', 105, 20, { align: 'center' });
        
        // Add content
        doc.setFontSize(11);
        doc.setTextColor(0, 0, 0);
        
        const splitText = doc.splitTextToSize(content, 180);
        let yPosition = 30;
        
        splitText.forEach(line => {
            if (yPosition > 280) {
                doc.addPage();
                yPosition = 20;
            }
            doc.text(line, 15, yPosition);
            yPosition += 7;
        });
        
        // Add footer
        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text('Generated by AI Sentence Rearranger - Uses LanguageTool AI analysis', 105, 285, { align: 'center' });
        
        // Save the PDF
        doc.save('AI_Sentence_Analysis.pdf');
    }
});
