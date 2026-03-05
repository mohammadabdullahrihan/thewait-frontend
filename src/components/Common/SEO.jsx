import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ title, description, keywords }) => {
  const siteName = 'অপেক্ষা | The Wait — সাধকের যাত্রা';
  const fullTitle = title ? `${title} | অপেক্ষা` : siteName;
  const defaultDesc = 'অপেক্ষা — একটি পার্সোনাল গ্রোথ ও ডিসিপ্লিন ট্র্যাকিং অ্যাপ। ডেইলি রুটিন, হ্যাবিট, পড়াশোনা এবং ওয়ার্কআউট ট্র্যাক করো।';

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description || defaultDesc} />
      {keywords && <meta name="keywords" content={keywords} />}
      
      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description || defaultDesc} />
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={description || defaultDesc} />
    </Helmet>
  );
};

export default SEO;
