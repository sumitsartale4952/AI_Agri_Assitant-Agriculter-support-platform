/**
 * FAQ Component - Fetches real answers from LLM backend
 * Replaces hardcoded FAQ answers with AI-generated responses
 */

import React, { useState, useEffect } from 'react';

export const FAQComponent = ({ category, title = "FAQs" }) => {
  const [expandedFAQ, setExpandedFAQ] = useState(null);
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Default questions for each category
  const defaultFAQs = {
    soil_health: [
      'How often should I test my soil?',
      'What documents can I upload?',
      'How accurate is the AI analysis?',
      'Can I get fertilizer recommendations?'
    ],
    yield_prediction: [
      'How accurate are yield predictions?',
      'What factors affect crop yield predictions?',
      'How can I improve yield prediction accuracy?',
      'What historical data is needed for yield models?'
    ],
    disease_management: [
      'How do I identify crop diseases from symptoms?',
      'What are the best prevention methods for major crop diseases?',
      'Which fungicides are most effective for disease control?',
      'How do I manage disease-resistant varieties?'
    ],
    irrigation: [
      'How often should I irrigate my crops?',
      'What is the water requirement for major crops?',
      'Which irrigation methods are most water-efficient?',
      'How do soil moisture and weather affect irrigation scheduling?'
    ],
    pest_control: [
      'How do I identify common crop pests in my region?',
      'What are integrated pest management (IPM) strategies?',
      'Are there organic alternatives to chemical pesticides?',
      'When is the best time to apply pest control measures?'
    ]
  };

  useEffect(() => {
    fetchFAQs();
  }, [category]);

  const fetchFAQs = async () => {
    setLoading(true);
    setError(null);

    try {
      const questions = defaultFAQs[category] || [];
      const faqData = [];

      // Fetch answers for each question from backend
      for (const question of questions) {
        try {
          const controller = new AbortController();
          const timeout = setTimeout(() => controller.abort(), 120000); // 120 second timeout for LLM processing

          const response = await fetch(
            `/api/llm-faq/generate?question=${encodeURIComponent(question)}&category=${category}`,
            {
              method: 'GET',
              headers: { 'Content-Type': 'application/json' },
              signal: controller.signal
            }
          );
          clearTimeout(timeout);

          if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Server responded with status ${response.status}: ${errorText}`);
          }

          const data = await response.json();

          if (data.success) {
            faqData.push({
              q: question,
              a: data.answer,
              success: true,
              responseTime: data.response_time_ms
            });
          } else {
            // Fallback to default answer if LLM fails
            faqData.push({
              q: question,
              a: data.fallback || 'Unable to generate answer. Ollama model may be offline. Please check LLM availability.',
              success: false,
              error: data.error
            });
          }
        } catch (err) {
          console.error(`Error fetching FAQ for: ${question}`, err);
          let errorMsg = 'Unable to fetch answer from server.';
          if (err.name === 'AbortError') {
            errorMsg = 'Request timeout - LLM took too long to respond (>120s). Model may be loading or busy.';
          } else if (err instanceof TypeError) {
            errorMsg = 'Network error or CORS issue. Check if backend is running.';
          } else if (err.message.startsWith('Server responded with status')) {
            errorMsg = `Server error: ${err.message}`;
          }
          faqData.push({
            q: question,
            a: errorMsg,
            success: false,
            error: err.message
          });
        }

        // Add small delay to avoid overwhelming the server
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      setFaqs(faqData);
    } catch (err) {
      console.error('Error fetching FAQs:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-3">
        <h4 className="font-bold text-textDark">{title}</h4>
        <div className="text-center py-8 text-textLight">
          <div className="inline-block">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mb-2"></div>
            <p className="text-sm">Loading AI-generated FAQs...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-3">
        <h4 className="font-bold text-textDark">{title}</h4>
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
          Error loading FAQs: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h4 className="font-bold text-textDark">{title}</h4>
      {faqs.length === 0 ? (
        <p className="text-textLight text-sm">No FAQs available</p>
      ) : (
        faqs.map((faq, idx) => (
          <div key={idx} className="border border-gray-200 rounded-lg overflow-hidden">
            <button
              onClick={() => setExpandedFAQ(expandedFAQ === idx ? null : idx)}
              className="w-full px-3 py-3 flex items-start gap-2 hover:bg-gray-50 transition-smooth text-left"
            >
              <span className="flex-shrink-0 text-lg">❓</span>
              <span className="font-medium text-xs text-textDark">{faq.q}</span>
            </button>
            {expandedFAQ === idx && (
              <div className="px-3 py-3 bg-gray-50 border-t border-gray-200 text-xs text-textLight leading-relaxed">
                {faq.a}
                {faq.responseTime && (
                  <div className="mt-2 text-xs text-gray-500 italic">
                    Response time: {faq.responseTime}ms {!faq.success && ' (Fallback)'}
                  </div>
                )}
              </div>
            )}
          </div>
        ))
      )}
      <button
        onClick={fetchFAQs}
        className="text-xs text-green-600 hover:text-green-700 font-medium mt-3"
      >
        Refresh FAQs ↻
      </button>
    </div>
  );
};

export default FAQComponent;
