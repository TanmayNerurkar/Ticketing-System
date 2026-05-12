import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, ArrowRight, Send } from 'lucide-react';
import { useCategories } from '../hooks/queries/useCategories';
import { useCreateTicket } from '../hooks/queries/useTickets';
import { useToast } from '../hooks/useToast';
import { CONTACT_TIMES } from '../lib/constants';
import Header from '../components/layout/Header';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Textarea from '../components/ui/Textarea';
import Select from '../components/ui/Select';
import Spinner from '../components/ui/Spinner';

function YesNoField({ label, value, onChange }) {
  return (
    <div>
      <label className="block text-xs font-medium text-stone-600 mb-1.5 uppercase tracking-wider">
        {label}
      </label>
      <div className="flex gap-2">
        {[
          { value: true, label: 'Yes' },
          { value: false, label: 'No' },
        ].map((opt) => (
          <button
            key={opt.label}
            onClick={() => onChange(opt.value)}
            type="button"
            className={`flex-1 py-2 text-sm border rounded transition-all ${
              value === opt.value
                ? 'border-stone-900 bg-stone-50 ring-1 ring-stone-900 text-stone-900 font-medium'
                : 'border-stone-200 bg-white text-stone-600 hover:border-stone-400'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function NewTicketPage() {
  const navigate = useNavigate();
  const toast = useToast();
  const { data: categories = [], isLoading: loadingCategories } = useCategories();
  const createTicket = useCreateTicket();

  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    categoryId: '',
    subcategory: '',
    description: '',
    noticedAt: '',
    blockingWork: null,
    affectsOthers: null,
    bestContactTime: 'ANYTIME',
  });

  const update = (key, value) => setForm((f) => ({ ...f, [key]: value }));
  const selectedCategory = categories.find((c) => c.id === form.categoryId);

  const canProceed = {
    1: !!form.categoryId,
    2: form.description.trim().length >= 20,
    3: form.blockingWork !== null && form.affectsOthers !== null,
  };

  const handleSubmit = () => {
    const payload = {
      categoryId: form.categoryId,
      subcategory: form.subcategory || null,
      description: form.description.trim(),
      noticedAt: form.noticedAt ? new Date(form.noticedAt).toISOString() : null,
      blockingWork: form.blockingWork,
      affectsOthers: form.affectsOthers,
      bestContactTime: form.bestContactTime,
    };

    createTicket.mutate(payload, {
      onSuccess: (ticket) => {
        toast.success(`Ticket ${ticket.ticketNumber} created`);
        navigate(`/tickets/${ticket.id}`);
      },
      onError: (err) => {
        toast.error(err.message || 'Failed to create ticket');
      },
    });
  };

  return (
    <>
      <Header title="Submit a ticket." subtitle={`Step ${step} of 3`} />

      <div className="p-8 max-w-2xl">
        <div className="flex items-center gap-2 mb-10">
          {[
            { n: 1, label: 'Category' },
            { n: 2, label: 'Describe' },
            { n: 3, label: 'Details' },
          ].map((s, i) => (
            <div key={s.n} className="flex items-center gap-2 flex-1">
              <div
                className={`flex items-center gap-2 ${
                  step >= s.n ? 'text-stone-900' : 'text-stone-400'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                    step >= s.n
                      ? 'bg-stone-900 text-stone-50'
                      : 'bg-stone-200 text-stone-500'
                  }`}
                >
                  {step > s.n ? <CheckCircle2 size={12} /> : s.n}
                </div>
                <span className="text-xs uppercase tracking-wider">
                  {s.label}
                </span>
              </div>
              {i < 2 && <div className="flex-1 h-px bg-stone-200" />}
            </div>
          ))}
        </div>

        {step === 1 && (
          <div>
            <h2 className="text-xl font-display font-medium text-stone-900 mb-1 tracking-tight">
              What kind of issue are you having?
            </h2>
            <p className="text-sm text-stone-600 mb-6">
              Choose the category that best matches your problem. This helps us
              route your ticket to the right specialist.
            </p>
            {loadingCategories ? (
              <div className="flex justify-center py-8">
                <Spinner />
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {categories.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => update('categoryId', c.id)}
                    type="button"
                    className={`text-left p-4 border rounded transition-all ${
                      form.categoryId === c.id
                        ? 'border-stone-900 bg-stone-50 ring-1 ring-stone-900'
                        : 'border-stone-200 bg-white hover:border-stone-400'
                    }`}
                  >
                    <div className="text-sm font-medium text-stone-900 mb-0.5">
                      {c.name}
                    </div>
                    <div className="text-xs text-stone-500 truncate">
                      {c.subcategories?.length
                        ? c.subcategories.slice(0, 2).join(' · ')
                        : 'General issues'}
                    </div>
                  </button>
                ))}
              </div>
            )}

            {selectedCategory?.subcategories?.length > 0 && (
              <div className="mt-6">
                <Select
                  label="Specific issue (optional)"
                  value={form.subcategory}
                  onChange={(e) => update('subcategory', e.target.value)}
                  options={[
                    { value: '', label: 'Select...' },
                    ...selectedCategory.subcategories.map((s) => ({
                      value: s,
                      label: s,
                    })),
                  ]}
                />
              </div>
            )}
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="text-xl font-display font-medium text-stone-900 mb-1 tracking-tight">
              Describe what is happening.
            </h2>
            <p className="text-sm text-stone-600 mb-6">
              Be as specific as you can — what you were doing, any error
              messages, and what you have already tried.
            </p>
            <Textarea
              label="Description"
              value={form.description}
              onChange={(e) => update('description', e.target.value)}
              placeholder="Example: When I try to open a patient chart in EMR, the application freezes and shows error code 0x80004005..."
              rows={8}
            />
            <div className="mt-1 text-xs text-stone-500 flex justify-between">
              <span>Minimum 20 characters</span>
              <span
                className={
                  form.description.length >= 20
                    ? 'text-green-700 font-medium'
                    : ''
                }
              >
                {form.description.length} / 20
              </span>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 className="text-xl font-display font-medium text-stone-900 mb-1 tracking-tight">
              A few more details.
            </h2>
            <p className="text-sm text-stone-600 mb-6">
              These help us prioritise your ticket and reach you at the right
              time.
            </p>
            <div className="space-y-5">
              <Input
                label="When did you first notice the problem? (optional)"
                type="datetime-local"
                value={form.noticedAt}
                onChange={(e) => update('noticedAt', e.target.value)}
              />
              <YesNoField
                label="Is it preventing you from doing your work?"
                value={form.blockingWork}
                onChange={(v) => update('blockingWork', v)}
              />
              <YesNoField
                label="Is anyone else experiencing the same problem?"
                value={form.affectsOthers}
                onChange={(v) => update('affectsOthers', v)}
              />
              <Select
                label="Best time to contact you"
                value={form.bestContactTime}
                onChange={(e) => update('bestContactTime', e.target.value)}
                options={CONTACT_TIMES}
              />
            </div>
          </div>
        )}

        <div className="flex items-center justify-between mt-10 pt-6 border-t border-stone-200">
          <Button
            variant="ghost"
            onClick={
              step === 1 ? () => navigate(-1) : () => setStep(step - 1)
            }
          >
            {step === 1 ? 'Cancel' : 'Back'}
          </Button>
          {step < 3 ? (
            <Button
              onClick={() => setStep(step + 1)}
              disabled={!canProceed[step]}
              iconRight={ArrowRight}
            >
              Continue
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={!canProceed[3]}
              loading={createTicket.isPending}
              icon={Send}
            >
              Submit ticket
            </Button>
          )}
        </div>
      </div>
    </>
  );
}