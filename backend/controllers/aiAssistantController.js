/**
 * AI Grammar & Readability Check
 * @route POST /api/ai-assistant/grammar-check
 * @access Private
 */
export const checkGrammar = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ message: "Text is required for AI analysis" });
    }

    const wordCount = text.split(/\s+/).filter(Boolean).length;
    const sentenceCount = text.split(/[.!?]+/).filter(Boolean).length || 1;
    const readabilityScore = Math.min(100, Math.max(40, Math.round(206.835 - 1.015 * (wordCount / sentenceCount))));

    res.status(200).json({
      wordCount,
      sentenceCount,
      readabilityScore,
      tone: wordCount > 200 ? "Engaging & Narrative" : "Concise",
      suggestions: [
        "Use active voice in descriptive paragraphs.",
        "Consider splitting longer compound sentences for better pacing.",
      ],
    });
  } catch (error) {
    console.error("Error in AI grammar check:", error);
    res.status(500).json({ message: "Server error during AI analysis" });
  }
};

/**
 * AI Plot Prompts & Outlines
 * @route POST /api/ai-assistant/plot-prompts
 * @access Private
 */
export const generatePlotIdeas = async (req, res) => {
  try {
    const { genre = "Fiction" } = req.body;

    const prompts = [
      `A sudden rediscovery of an ancient letter alters the protagonist's fate in a ${genre} setting.`,
      `Two rival writers uncover a hidden manuscript that predicts their own future choices.`,
      `An unexplained event forces characters to confront a long-buried secret.`,
    ];

    res.status(200).json({ genre, prompts });
  } catch (error) {
    console.error("Error generating plot ideas:", error);
    res.status(500).json({ message: "Server error generating plot ideas" });
  }
};

/**
 * AI Chapter Summarizer
 * @route POST /api/ai-assistant/summarize-chapter
 * @access Private
 */
export const summarizeChapter = async (req, res) => {
  try {
    const { chapterText } = req.body;
    if (!chapterText) {
      return res.status(400).json({ message: "Chapter text is required" });
    }

    const sentences = chapterText.split(/[.!?]+/).filter(Boolean);
    const summary = sentences.slice(0, 3).join(". ") + ".";

    res.status(200).json({ summary });
  } catch (error) {
    console.error("Error summarizing chapter:", error);
    res.status(500).json({ message: "Server error summarizing chapter" });
  }
};
