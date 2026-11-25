'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Camera, AlertCircle } from 'lucide-react';
import { Html5Qrcode } from 'html5-qrcode';

interface QrScannerProps {
  onScanSuccess: (extractedId: string) => void;
  onError?: (errorMessage: string) => void;
}

export default function QrScanner({ onScanSuccess, onError }: QrScannerProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [cameras, setCameras] = useState<Array<{ id: string; label: string }>>([]);
  const [selectedCameraId, setSelectedCameraId] = useState<string>('');
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const regionId = 'qr-reader-region';

  // Ekstrak ID dari hasil scan teks QR (bisa berupa URL penuh atau langsung ID)
  const parseScannedText = useCallback((text: string): string => {
    try {
      // Jika hasil scan adalah URL (misal: https://veritas.app/verifikasi/ABC123XYZ0)
      if (text.startsWith('http://') || text.startsWith('https://')) {
        const url = new URL(text);
        const parts = url.pathname.split('/').filter(Boolean);
        const verifikasiIndex = parts.indexOf('verifikasi');
        if (verifikasiIndex !== -1 && parts[verifikasiIndex + 1]) {
          return parts[verifikasiIndex + 1];
        }
        return parts[parts.length - 1];
      }
    } catch {
      // bukan URL, abaikan dan kembalikan langsung
    }
    return text.trim();
  }, []);

  const stopScanning = useCallback(async () => {
    if (scannerRef.current && scannerRef.current.isScanning) {
      try {
        await scannerRef.current.stop();
        await scannerRef.current.clear();
      } catch (err) {
        console.warn('Error stopping scanner:', err);
      }
    }
    setIsScanning(false);
  }, []);

  const startScanning = useCallback(async (cameraIdToUse?: string) => {
    try {
      setErrorMessage(null);
      if (!scannerRef.current) {
        scannerRef.current = new Html5Qrcode(regionId);
      }

      const activeCameraId = cameraIdToUse || selectedCameraId;

      await scannerRef.current.start(
        activeCameraId ? { deviceId: { exact: activeCameraId } } : { facingMode: 'environment' },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0,
        },
        (decodedText) => {
          const docId = parseScannedText(decodedText);
          stopScanning();
          onScanSuccess(docId);
        },
        () => {
          // Abaikan frame scan gagal umum
        }
      );

      setIsScanning(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Gagal mengakses kamera.';
      setErrorMessage(msg);
      setIsScanning(false);
      onError?.(msg);
    }
  }, [selectedCameraId, parseScannedText, stopScanning, onScanSuccess, onError]);

  // Dapatkan daftar kamera saat komponen dipasang
  useEffect(() => {
    let mounted = true;

    Html5Qrcode.getCameras()
      .then((devices) => {
        if (!mounted) return;
        if (devices && devices.length > 0) {
          const formatted = devices.map((d) => ({ id: d.id, label: d.label || `Kamera ${d.id}` }));
          setCameras(formatted);
          // Pilih kamera belakang jika ada kata 'back' atau 'rear'
          const backCam = formatted.find(
            (c) => c.label.toLowerCase().includes('back') || c.label.toLowerCase().includes('rear')
          );
          setSelectedCameraId(backCam ? backCam.id : formatted[0].id);
        } else {
          setErrorMessage('Tidak ada kamera yang ditemukan pada perangkat ini.');
        }
      })
      .catch((err) => {
        if (!mounted) return;
        setErrorMessage('Gagal mendeteksi kamera. Pastikan izin kamera telah diberikan.');
        console.error('Error getting cameras:', err);
      });

    return () => {
      mounted = false;
      if (scannerRef.current && scannerRef.current.isScanning) {
        scannerRef.current.stop().catch(() => {});
      }
    };
  }, []);

  return (
    <div className="w-full flex flex-col items-center">
      {/* Container Scanner */}
      <div className="relative w-full max-w-sm aspect-square bg-black border border-[#D6D5CF] rounded-sm overflow-hidden flex flex-col items-center justify-center">
        <div id={regionId} className="w-full h-full" />

        {!isScanning && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-[#111111]/80 text-[#E9E8E3] backdrop-blur-sm z-10">
            <Camera className="w-12 h-12 mb-3 text-[#E9E8E3]/60 stroke-1" />
            <p className="font-serif-light text-lg mb-4">Arahkan kamera ke QR Code dokumen</p>
            <button
              onClick={() => startScanning()}
              type="button"
              className="px-5 py-2.5 bg-[#E9E8E3] text-[#111111] text-xs font-mono tracking-widest uppercase hover:bg-white transition-colors"
            >
              Mulai Kamera
            </button>
          </div>
        )}

        {/* Framing border styling overlay saat scanning */}
        {isScanning && (
          <div className="pointer-events-none absolute inset-0 border-2 border-dashed border-[#2E7D5B]/60 m-8 rounded-sm animate-pulse-soft" />
        )}
      </div>

      {/* Kontrol Kamera */}
      <div className="w-full max-w-sm mt-3 flex items-center justify-between text-xs font-mono">
        {cameras.length > 1 && (
          <select
            value={selectedCameraId}
            onChange={(e) => {
              const newId = e.target.value;
              setSelectedCameraId(newId);
              if (isScanning) {
                stopScanning().then(() => startScanning(newId));
              }
            }}
            className="bg-transparent border border-[#D6D5CF] px-2 py-1 text-[#111111] max-w-[200px] truncate"
          >
            {cameras.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>
        )}

        {isScanning && (
          <button
            onClick={stopScanning}
            type="button"
            className="ml-auto text-[#A63D3D] hover:underline uppercase tracking-wider"
          >
            Hentikan Kamera
          </button>
        )}
      </div>

      {errorMessage && (
        <div className="w-full max-w-sm mt-3 p-3 border border-[#A63D3D]/30 bg-[#A63D3D]/5 text-[#A63D3D] text-xs font-mono flex items-start gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
}
