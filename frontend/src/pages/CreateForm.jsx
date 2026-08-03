import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import FieldList from '../components/FormBuilder/FieldList';
import FieldEditor from '../components/FormBuilder/FieldEditor';
import FormPreview from '../components/FormBuilder/FormPreview';
import FormSettings from '../components/FormBuilder/FormSettings';
import Button from '../components/UI/Button';
import { useFormStore } from '../store/formStore';
import api from '../services/api';
import { Save, ArrowLeft, Sliders, Layers } from 'lucide-react';

const CreateForm = () => {
  const [activeTab, setActiveTab] = useState('build'); // 'build' | 'settings'
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();
  const { id: editFormId } = useParams();

  const {
    formId,
    name,
    fields,
    settings,
    selectedFieldId,
    setFormName,
    setFormState,
    resetForm,
    addField,
    removeField,
    selectField,
    updateField,
    moveField,
    updateSettings
  } = useFormStore();

  useEffect(() => {
    if (!editFormId) {
      resetForm();
    } else if (editFormId && editFormId !== formId) {
      fetchExistingForm(editFormId);
    }
  }, [editFormId]);

  const fetchExistingForm = async (id) => {
    try {
      const res = await api.get(`/forms/${id}`);
      if (res.form) {
        setFormState(res.form);
      }
    } catch (err) {
      alert('Failed to load form details.');
      navigate('/forms');
    }
  };

  const handleSaveForm = async () => {
    if (!name || name.trim() === '') {
      alert('Please enter a form name.');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        name,
        fields,
        settings
      };

      if (formId) {
        await api.put(`/forms/${formId}`, payload);
      } else {
        const res = await api.post('/forms', payload);
        if (res.form) {
          setFormState(res.form);
        }
      }

      navigate('/forms');
    } catch (err) {
      alert('Failed to save form. ' + (err.message || ''));
    } finally {
      setSaving(false);
    }
  };

  const selectedField = fields.find((f) => f.id === selectedFieldId);
  const selectedFieldIndex = fields.findIndex((f) => f.id === selectedFieldId);

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] -m-8 overflow-hidden">
      {/* Studio Header Bar */}
      <div className="h-16 bg-slate-900 border-b border-slate-800 px-6 flex items-center justify-between z-20">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/forms')}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <input
              type="text"
              value={name}
              onChange={(e) => setFormName(e.target.value)}
              className="bg-transparent font-extrabold text-slate-100 text-lg focus:outline-none focus:bg-slate-800/50 px-2 py-1 rounded border border-transparent focus:border-slate-700 transition"
              placeholder="Form Name"
            />
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab('build')}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition ${
              activeTab === 'build' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" /> Fields Builder
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition ${
              activeTab === 'settings' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" /> Form Settings
          </button>
        </div>

        {/* Action Button */}
        <Button onClick={handleSaveForm} loading={saving}>
          <Save className="w-4 h-4 mr-2" /> {formId ? 'Update Form' : 'Save & Publish'}
        </Button>
      </div>

      {/* Main Studio Workspace */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Palette */}
        <FieldList onAddField={addField} />

        {/* Center Preview Canvas */}
        <FormPreview
          formTitle={name}
          fields={fields}
          settings={settings}
          selectedFieldId={selectedFieldId}
          onSelectField={selectField}
        />

        {/* Right Properties Panel */}
        {activeTab === 'build' ? (
          <FieldEditor
            field={selectedField}
            fieldIndex={selectedFieldIndex}
            totalFields={fields.length}
            onUpdateField={updateField}
            onDeleteField={removeField}
            onMoveField={moveField}
          />
        ) : (
          <FormSettings
            name={name}
            settings={settings}
            onUpdateName={setFormName}
            onUpdateSettings={updateSettings}
          />
        )}
      </div>
    </div>
  );
};

export default CreateForm;
