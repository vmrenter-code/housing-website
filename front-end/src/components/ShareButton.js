import React, { useState } from 'react';

export default function ShareButton({ listing }) {
  const [copied, setCopied] = useState(false);

  const listingUrl = `${window.location.origin}/listing/${listing._id}`;
  const shareText = `Check out this housing listing: ${listing.title}`;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: listing.title,
          text: shareText,
          url: listingUrl,
        });
      } catch (err) {
        // User cancelled share
      }
    } else {
      await navigator.clipboard.writeText(listingUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <button className="share-listing-btn" onClick={handleShare}>
      {copied ? 'Link Copied!' : 'Share'}
    </button>
  );
}