import { useState } from 'react';
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import type { AnalysisResult, OverallStrategy } from '@/types';

// Define styles for PDF
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 20,
  },
  header: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  text: {
    fontSize: 10,
    marginBottom: 8,
  },
});

// Simple PDF Documents
const PDFDocument = ({ strategy }: { strategy: OverallStrategy }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.header}>Overall Content Strategy</Text>
      <Text style={styles.text}>Content strategy details will be included in the download.</Text>
    </Page>
  </Document>
);

const IndividualPDFDocument = ({ result }: { result: AnalysisResult }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.header}>{result.content.title}</Text>
      <Text style={styles.text}>Analysis details will be included in the download.</Text>
    </Page>
  </Document>
);

const EmptyPDFDocument = () => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text>No content available</Text>
    </Page>
  </Document>
);

interface PDFButtonProps {
  view: 'overall' | 'individual';
  overallStrategy?: OverallStrategy | null;
  result?: AnalysisResult;
  onClose: () => void;
}

export default function PDFButton({ view, overallStrategy, result, onClose }: PDFButtonProps) {
  const [error, setError] = useState<string | null>(null);

  if (error) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg p-6 max-w-md w-full">
          <h3 className="text-red-500 font-semibold mb-4">Error Generating PDF</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <div className="flex justify-end gap-4">
            <button
              onClick={() => setError(null)}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Try Again
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h3 className="font-semibold mb-4">Generate PDF</h3>
        <p className="text-gray-600 mb-4">Click the button below to download your PDF.</p>
        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Cancel
          </button>
          <PDFDownloadLink
            document={
              view === 'overall' && overallStrategy ? (
                <PDFDocument strategy={overallStrategy} />
              ) : result ? (
                <IndividualPDFDocument result={result} />
              ) : (
                <EmptyPDFDocument />
              )
            }
            fileName={
              view === 'overall'
                ? `overall-strategy-${new Date().toISOString().split('T')[0]}.pdf`
                : `content-analysis-${result?.content.title?.slice(0, 30) || 'analysis'}.pdf`
            }
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            {({ blob, url, loading, error }) => {
              if (error) {
                setError(error.message);
                return null;
              }
              return loading ? 'Preparing Download...' : 'Download PDF';
            }}
          </PDFDownloadLink>
        </div>
      </div>
    </div>
  );
} 