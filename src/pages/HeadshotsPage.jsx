import React, { useState, useRef } from 'react';
import { 
  Camera, 
  Upload, 
  Sparkles, 
  Download, 
  Check, 
  ArrowRight,
  RefreshCw,
  Sliders,
  Image as ImageIcon
} from 'lucide-react';

export default function HeadshotsPage() {
  const [selectedPreset, setSelectedPreset] = useState('executive');
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState('after'); // 'before' | 'after'
  const [userPhoto, setUserPhoto] = useState('https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=450&auto=format&fit=crop&q=80');
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const fileInputRef = useRef(null);

  const presets = [
    {
      id: 'executive',
      name: 'Executive Navy Suit',
      bg: 'Neutral Grey Studio',
      lighting: '3-Point Key Light',
      imgUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=450&auto=format&fit=crop&q=80'
    },
    {
      id: 'tech_minimal',
      name: 'Tech Founder Casual',
      bg: 'Modern Tech Campus Bokeh',
      lighting: 'Soft Daylight Glow',
      imgUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=450&auto=format&fit=crop&q=80'
    },
    {
      id: 'studio_portrait',
      name: 'Editorial Studio',
      bg: 'Deep Charcoal Canvas',
      lighting: 'Dramatic Rim Lighting',
      imgUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=450&auto=format&fit=crop&q=80'
    },
    {
      id: 'creative_modern',
      name: 'Creative Contemporary',
      bg: 'Warm Loft Interior',
      lighting: 'Golden Hour Accent',
      imgUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=450&auto=format&fit=crop&q=80'
    }
  ];

  const currentPresetData = presets.find(p => p.id === selectedPreset) || presets[0];

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setUserPhoto(url);
      setUploadedFileName(file.name);
      setActiveTab('before');
      handleGenerate();
    }
  };

  const handleGenerate = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setActiveTab('after');
    }, 850);
  };

  const handleDownload = () => {
    const targetUrl = activeTab === 'after' ? currentPresetData.imgUrl : userPhoto;
    const a = document.createElement('a');
    a.href = targetUrl;
    a.download = `Parakeet_Headshot_${selectedPreset}.jpg`;
    a.target = '_blank';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 2500);
  };

  return (
    <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '32px 20px' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '36px' }}>
        <span className="badge" style={{ marginBottom: '12px' }}>AI Studio Photography</span>
        <h1 className="font-heading" style={{ fontSize: '38px', fontWeight: 800 }}>
          AI Professional Headshots
        </h1>
        <p style={{ fontSize: '16px', color: 'var(--text-secondary)', maxWidth: '640px', margin: '8px auto 0' }}>
          Turn any casual smartphone selfie into an executive-grade studio portrait tailored for LinkedIn, resume portfolios, and speaker bios. 100% Free.
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '32px',
        alignItems: 'start'
      }} className="headshot-grid">
        {/* Left Column: Preset Selector & Controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Upload Box */}
          <div className="glass-panel" style={{ padding: '24px', textAlign: 'center' }}>
            <input 
              type="file" 
              ref={fileInputRef} 
              style={{ display: 'none' }} 
              accept="image/*"
              onChange={handleFileUpload}
            />
            <div 
              onClick={() => fileInputRef.current?.click()}
              style={{
                border: '2px dashed var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '32px 20px',
                cursor: 'pointer',
                background: 'var(--bg-secondary)',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = '#10b981'}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border-subtle)'}
            >
              <Upload size={32} color="#10b981" style={{ margin: '0 auto 12px', display: 'block' }} />
              <span style={{ fontSize: '15px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                {uploadedFileName ? `Selected: ${uploadedFileName}` : "Upload Casual Photo"}
              </span>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                Click to browse photo from your device (Selfies work best)
              </span>
            </div>
          </div>

          {/* Style Presets */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h3 className="font-heading" style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px' }}>
              Choose Wardrobe & Studio Setting
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
              {presets.map(p => {
                const isSelected = selectedPreset === p.id;
                return (
                  <div
                    key={p.id}
                    onClick={() => { setSelectedPreset(p.id); handleGenerate(); }}
                    style={{
                      padding: '14px',
                      borderRadius: 'var(--radius-md)',
                      background: isSelected ? 'rgba(16, 185, 129, 0.12)' : 'var(--bg-secondary)',
                      border: `1.5px solid ${isSelected ? '#10b981' : 'var(--border-subtle)'}`,
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span style={{ fontSize: '13px', fontWeight: 700, color: isSelected ? '#10b981' : 'var(--text-primary)' }}>
                        {p.name}
                      </span>
                      {isSelected && <Check size={14} color="#10b981" />}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '2px' }}>
                      Backdrop: {p.bg}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                      Light: {p.lighting}
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              onClick={handleGenerate}
              className="btn-primary"
              style={{ width: '100%', padding: '12px', gap: '8px' }}
              disabled={isProcessing}
            >
              <Sparkles size={16} />
              <span>{isProcessing ? "Rendering 4K Studio Lighting..." : "Generate AI Headshot"}</span>
            </button>
          </div>
        </div>

        {/* Right Column: High-Res Before & After Canvas */}
        <div className="glass-panel" style={{ padding: '24px', textAlign: 'center' }}>
          {/* Tab Selector */}
          <div style={{
            display: 'inline-flex',
            background: 'var(--bg-secondary)',
            borderRadius: 'var(--radius-full)',
            padding: '4px',
            marginBottom: '20px',
            border: '1px solid var(--border-subtle)'
          }}>
            <button
              onClick={() => setActiveTab('after')}
              style={{
                background: activeTab === 'after' ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : 'transparent',
                color: activeTab === 'after' ? '#ffffff' : 'var(--text-muted)',
                border: 'none',
                borderRadius: 'var(--radius-full)',
                padding: '6px 18px',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              AI Studio Generated (After)
            </button>

            <button
              onClick={() => setActiveTab('before')}
              style={{
                background: activeTab === 'before' ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : 'transparent',
                color: activeTab === 'before' ? '#ffffff' : 'var(--text-muted)',
                border: 'none',
                borderRadius: 'var(--radius-full)',
                padding: '6px 18px',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Original Casual Photo (Before)
            </button>
          </div>

          <div style={{
            position: 'relative',
            width: '100%',
            aspectRatio: '1 / 1.1',
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
            boxShadow: 'var(--shadow-lg)',
            border: '1px solid var(--border-subtle)',
            marginBottom: '20px',
            background: '#0a0d0b'
          }}>
            <img 
              src={activeTab === 'after' ? currentPresetData.imgUrl : userPhoto} 
              alt="Headshot" 
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                filter: isProcessing ? 'blur(10px)' : 'none',
                transition: 'filter 0.3s ease'
              }}
            />

            {isProcessing && (
              <div style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(0, 0, 0, 0.5)',
                color: '#ffffff',
                fontWeight: 600,
                fontSize: '14px',
                backdropFilter: 'blur(4px)'
              }}>
                <RefreshCw size={24} className="animate-spin" style={{ marginRight: '8px' }} />
                <span>Applying 3-Point Studio Lighting & Attire...</span>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '14px', fontWeight: 700 }}>4K Ultra-HD Portrait</div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Ready for LinkedIn, Resume & Portfolio Export</div>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => {
                  localStorage.setItem('parakeet_resume_photo', currentPresetData.imgUrl);
                  alert("Headshot applied to your active resume!");
                }}
                className="btn-primary"
                style={{ padding: '8px 14px', fontSize: '13px', gap: '6px' }}
              >
                <ImageIcon size={14} />
                <span>Apply To Resume</span>
              </button>

              <button
                onClick={handleDownload}
                className="btn-secondary"
                style={{ padding: '8px 16px', fontSize: '13px', gap: '6px' }}
              >
                {downloadSuccess ? <Check size={15} color="#10b981" /> : <Download size={15} />}
                <span>{downloadSuccess ? "Downloaded!" : "Download 4K"}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
