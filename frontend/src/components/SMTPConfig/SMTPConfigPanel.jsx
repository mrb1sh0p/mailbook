import React, { useState, useEffect } from 'react';
import SMTPConfigSelector from './SMTPConfigSelector';
import SMTPConfigForm from './SMTPConfigForm';

const SMTPConfigPanel = ({
  orgs,
  smtpList,
  saveSMTP,
  updateSMTP,
  loading,
  setLoading,
}) => {
  const [selectedOrgId, setSelectedOrgId] = useState('');
  const [smtps, setSmtps] = useState([]);
  const [selectedConfig, setSelectedConfig] = useState(null);

  useEffect(() => {
    if (selectedOrgId) {
      fetchSmtpConfigs(selectedOrgId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedOrgId]);

  const fetchSmtpConfigs = async (orgId) => {
    setLoading(true);
    try {
      const orgSmtps = smtpList.filter((smtp) => smtp.org_id === orgId);
      setSmtps(orgSmtps || []);
    } catch (error) {
      console.error('Erro ao carregar SMTPs', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOrg = (orgId) => {
    setSelectedOrgId(orgId);
  };

  const handleSelectSmtp = (id) => {
    const selected = smtps.find((smtp) => smtp.id === id);
    setSelectedConfig(selected);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm dark:bg-gray-800">
      <div className="mt-6">
        <div className="mb-4">
          <label className="block mb-2 font-medium text-gray-900 dark:text-white">
            Selecione a Organização:
          </label>
          <select
            value={selectedOrgId}
            onChange={(e) => handleSelectOrg(e.target.value)}
            className="w-full p-2 border rounded-lg bg-white text-black dark:bg-gray-700 dark:text-white"
            required
          >
            <option value="" disabled>
              Selecione...
            </option>
            {orgs.map((org) => (
              <option key={org.id} value={org.id}>
                {org.name}
              </option>
            ))}
          </select>
        </div>

        {selectedOrgId && (
          <SMTPConfigSelector
            configs={smtps}
            selectedId={selectedConfig?.id}
            onSelect={handleSelectSmtp}
          />
        )}

        {selectedOrgId && (
          <SMTPConfigForm
            initialConfig={selectedConfig}
            onUpdate={updateSMTP}
            onSave={saveSMTP}
            loading={loading}
            org_id={selectedOrgId}
          />
        )}
      </div>
    </div>
  );
};

export default SMTPConfigPanel;
