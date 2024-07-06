// useAppState.ts
import { useState, useEffect } from 'react';
import { loadPdfFiles, savePdfFiles } from '../utils/utils';

export const useAppState = () => {
  const [inputText, setInputText] = useState('');
  const [displayText, setDisplayText] = useState('');
  const [pdfFiles, setPdfFiles] = useState<string[]>([]);

  useEffect(() => {
    loadPdfFilesFromStorage();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDisplayText('');
    }, 5000);

    return () => clearTimeout(timer);
  }, [displayText]);

  const loadPdfFilesFromStorage = async () => {
    const storedPdfFiles = await loadPdfFiles();
    setPdfFiles(storedPdfFiles);
  };

  const savePdfFilesToStorage = async (files: string[]) => {
    await savePdfFiles(files);
    setPdfFiles(files);
  };

  return {
    inputText,
    setInputText,
    displayText,
    setDisplayText,
    pdfFiles,
    setPdfFiles,
    savePdfFilesToStorage,
    loadPdfFilesFromStorage,
  };
};
