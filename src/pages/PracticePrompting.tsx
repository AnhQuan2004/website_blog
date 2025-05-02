import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Lightbulb, 
  Plus, 
  Check, 
  Sparkles, 
  Send, 
  Copy, 
  Settings, 
  Key, 
  X,
  Bot
} from 'lucide-react';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const promptTemplates = [
  {
    title: 'Explain a Concept',
    template: 'Explain [concept] in simple terms as if I am a [target audience].',
    example: 'Explain quantum computing in simple terms as if I am a 10-year-old.',
    tips: ['Specify your desired complexity level', 'Mention your background knowledge', 'Ask for analogies or examples']
  },
  {
    title: 'Coding Assistant',
    template: 'Write a [language] function that [functionality]. Include comments to explain the code.',
    example: 'Write a JavaScript function that sorts an array of objects by a specific property. Include comments to explain the code.',
    tips: ['Specify the programming language', 'Describe the exact functionality needed', 'Ask for explanations or test cases']
  },
  {
    title: 'Content Creation',
    template: 'Create a [content type] about [topic] for [audience] with a [tone] tone.',
    example: 'Create a blog post about sustainable living for millennials with an informative but conversational tone.',
    tips: ['Define the content format clearly', 'Specify your target audience', 'Mention the desired tone and length']
  },
  {
    title: 'Problem Solving',
    template: 'I need to [goal]. My current situation is [context]. What steps should I take to achieve this?',
    example: 'I need to optimize my website loading speed. My current situation is that it takes 5 seconds to load and uses many large images. What steps should I take to achieve this?',
    tips: ['Provide relevant context', 'Be specific about constraints', 'Clearly state your goal']
  }
];

const promptingTips = [
  {
    title: 'Be Specific',
    description: 'Include details about exactly what you want. The more specific your request, the better the response.',
    icon: <Check className="h-4 w-4" />
  },
  {
    title: 'Provide Context',
    description: 'Include background information, your goal, and any constraints or preferences.',
    icon: <Lightbulb className="h-4 w-4" />
  },
  {
    title: 'Use Templates',
    description: 'Structure your prompts with templates to ensure you include all relevant information.',
    icon: <Plus className="h-4 w-4" />
  },
  {
    title: 'Iterate and Refine',
    description: 'Don\'t expect perfect results on the first try. Refine your prompt based on the responses you get.',
    icon: <Sparkles className="h-4 w-4" />
  }
];

const modelOptions = [
  { id: 'default', name: 'Default (Demo)', apiKeyName: null, logo: '⚡' },
  { id: 'openai', name: 'OpenAI GPT-4', apiKeyName: 'OPENAI_API_KEY', logo: '🟢' },
  { id: 'claude', name: 'Anthropic Claude', apiKeyName: 'ANTHROPIC_API_KEY', logo: '🟠' },
  { 
    id: 'gemini', 
    name: 'Google Gemini', 
    apiKeyName: 'GOOGLE_API_KEY', 
    logo: '🔵',
    variants: [
      { id: 'gemini-pro', name: 'Gemini Pro' },
      { id: 'gemini-pro-vision', name: 'Gemini Pro Vision' },
      { id: 'gemini-ultra', name: 'Gemini Ultra' }
    ]
  }
];

const PracticePrompting = () => {
  const [prompt, setPrompt] = useState('');
  const [feedback, setFeedback] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [selectedModel, setSelectedModel] = useState(modelOptions[0]);
  const [selectedGeminiVariant, setSelectedGeminiVariant] = useState('gemini-pro');
  const [apiKeys, setApiKeys] = useState({
    OPENAI_API_KEY: localStorage.getItem('OPENAI_API_KEY') || '',
    ANTHROPIC_API_KEY: localStorage.getItem('ANTHROPIC_API_KEY') || '',
    GOOGLE_API_KEY: localStorage.getItem('GOOGLE_API_KEY') || ''
  });
  const [isConfigured, setIsConfigured] = useState(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useEffect(() => {
    // Check if the selected model has an API key configured
    if (selectedModel.id === 'default') {
      setIsConfigured(true);
      return;
    }
    
    const currentApiKey = apiKeys[selectedModel.apiKeyName];
    setIsConfigured(!!currentApiKey);
  }, [selectedModel, apiKeys]);

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
    setPrompt(template.template);
  };

  const handleApiKeyChange = (keyName, value) => {
    setApiKeys(prev => ({
      ...prev,
      [keyName]: value
    }));
  };

  const saveApiKeys = () => {
    // Save API keys to localStorage
    Object.entries(apiKeys).forEach(([key, value]) => {
      if (value) {
        localStorage.setItem(key, value);
      } else {
        localStorage.removeItem(key);
      }
    });
    
    toast.success('API keys saved successfully');
    setIsSettingsOpen(false);
  };

  const handleModelSelect = (modelId) => {
    const model = modelOptions.find(m => m.id === modelId);
    setSelectedModel(model);
  };

  const handleGeminiVariantSelect = (variantId) => {
    setSelectedGeminiVariant(variantId);
  };

  const handleAnalyzePrompt = () => {
    if (!prompt.trim()) {
      toast.error('Please enter a prompt to analyze');
      return;
    }

    if (selectedModel.id !== 'default' && !isConfigured) {
      toast.error(`Please configure your ${selectedModel.name} API key first`);
      setIsSettingsOpen(true);
      return;
    }

    // Get the full model name (including Gemini variant if applicable)
    let modelDisplayName = selectedModel.name;
    if (selectedModel.id === 'gemini') {
      const variant = selectedModel.variants.find(v => v.id === selectedGeminiVariant);
      modelDisplayName = variant ? `${selectedModel.name} - ${variant.name}` : selectedModel.name;
    }

    // Simulate AI analysis of the prompt
    toast.success(`Analyzing your prompt using ${modelDisplayName}...`);
    setTimeout(() => {
      // This would be replaced with actual API calls to the selected model
      const suggestions = [];
      
      if (prompt.length < 20) {
        suggestions.push('Your prompt is quite short. Consider adding more details.');
      }
      
      if (!prompt.includes('?') && !prompt.includes('please')) {
        suggestions.push('Consider making your request clearer with a question or using "please".');
      }
      
      if (!prompt.match(/\b(specific|exactly|precisely)\b/i)) {
        suggestions.push('Be more specific about what you want to achieve.');
      }
      
      if (!prompt.match(/\b(because|since|as|due to)\b/i)) {
        suggestions.push('Add context by explaining why you need this information.');
      }

      if (suggestions.length === 0) {
        setFeedback('Great prompt! It\'s clear, specific, and provides good context. Here are some minor suggestions to make it even better:\n\n- Consider specifying the format you want the response in\n- Add any relevant background knowledge you already have\n- Clarify if you need examples or analogies');
      } else {
        setFeedback(`Here's how you could improve your prompt:\n\n${suggestions.map(s => `- ${s}`).join('\n\n')}`);
      }
    }, 1000);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success('Copied to clipboard!');
    });
  };

  return (
    <div className="container py-12 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Practice Prompting</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Learn to craft effective prompts for AI tools and improve your results with guided practice and feedback.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="col-span-1">
          <Card className="mb-6">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-lg">Prompting Tips</CardTitle>
                  <CardDescription className="text-xs">
                    Best practices for crafting effective prompts
                  </CardDescription>
                </div>
                <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="icon">
                      <Settings size={16} />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>API Configuration</DialogTitle>
                      <DialogDescription>
                        Enter your API keys to use different AI models.
                        These keys are stored in your browser only.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      {modelOptions.map((model) => (
                        <div key={model.id} className="space-y-2">
                          <Label htmlFor={model.apiKeyName} className="flex items-center gap-2">
                            <span>{model.logo}</span> {model.name}
                          </Label>
                          <div className="flex gap-2">
                            <Input
                              id={model.apiKeyName}
                              type="password"
                              placeholder={`Enter your ${model.name} API key`}
                              value={apiKeys[model.apiKeyName]}
                              onChange={(e) => handleApiKeyChange(model.apiKeyName, e.target.value)}
                            />
                            {apiKeys[model.apiKeyName] && (
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleApiKeyChange(model.apiKeyName, '')}
                              >
                                <X size={16} />
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                      </DialogClose>
                      <Button onClick={saveApiKeys}>Save</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {promptingTips.map((tip, index) => (
                  <div key={index} className="flex gap-2">
                    <div className="bg-primary/10 rounded-full p-1.5 text-primary h-fit mt-0.5">
                      {tip.icon}
                    </div>
                    <div>
                      <h3 className="text-sm font-medium">{tip.title}</h3>
                      <p className="text-xs text-muted-foreground">{tip.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Template Library</CardTitle>
              <CardDescription className="text-xs">
                Choose a template to get started
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {promptTemplates.map((template, index) => (
                  <div 
                    key={index} 
                    className="p-3 border rounded-lg cursor-pointer hover:bg-secondary transition-colors"
                    onClick={() => handleTemplateSelect(template)}
                  >
                    <h3 className="text-sm font-medium">{template.title}</h3>
                    <p className="text-xs text-muted-foreground mt-1">{template.template}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="col-span-1 lg:col-span-2">
          <div className="mb-4 flex justify-end gap-2">
            <Select value={selectedModel.id} onValueChange={handleModelSelect}>
              <SelectTrigger className="w-[220px]">
                <SelectValue>
                  <div className="flex items-center gap-2">
                    <span>{selectedModel.logo}</span>
                    <span>{selectedModel.name}</span>
                    {selectedModel.id !== 'default' && !isConfigured && 
                      <Key className="h-3.5 w-3.5 ml-2 text-amber-500" />
                    }
                  </div>
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {modelOptions.map((model) => (
                  <SelectItem key={model.id} value={model.id}>
                    <div className="flex items-center gap-2">
                      <span>{model.logo}</span>
                      <span>{model.name}</span>
                      {model.id !== 'default' && !apiKeys[model.apiKeyName] && 
                        <Key className="h-3.5 w-3.5 ml-2 text-amber-500" />
                      }
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {selectedModel.id === 'gemini' && (
              <Select value={selectedGeminiVariant} onValueChange={handleGeminiVariantSelect}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {selectedModel.variants.map((variant) => (
                    <SelectItem key={variant.id} value={variant.id}>
                      {variant.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
          
          <Tabs defaultValue="practice">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="practice">Practice</TabsTrigger>
              <TabsTrigger value="examples">Template Examples</TabsTrigger>
            </TabsList>
            
            <TabsContent value="practice" className="mt-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>Craft Your Prompt</CardTitle>
                  <CardDescription>
                    Write your prompt and get feedback on how to improve it
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Textarea 
                    placeholder="Enter your prompt here..." 
                    className="min-h-[200px]"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                  />
                  
                  <div className="flex justify-end mt-4">
                    <Button 
                      className="flex items-center gap-2"
                      onClick={handleAnalyzePrompt}
                    >
                      <Bot size={16} />
                      {selectedModel.id === 'gemini' 
                        ? `Analyze with ${selectedModel.variants.find(v => v.id === selectedGeminiVariant)?.name}` 
                        : `Analyze with ${selectedModel.name}`}
                    </Button>
                  </div>
                  
                  {feedback && (
                    <div className="mt-6">
                      <h3 className="font-medium mb-2">Feedback</h3>
                      <div className="bg-secondary/50 p-4 rounded-lg relative">
                        <Button 
                          size="icon" 
                          variant="ghost" 
                          className="absolute top-2 right-2"
                          onClick={() => copyToClipboard(feedback)}
                        >
                          <Copy size={16} />
                        </Button>
                        <p className="whitespace-pre-line">{feedback}</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="examples" className="mt-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>Template Examples</CardTitle>
                  <CardDescription>
                    Study these examples to understand effective prompt patterns
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {promptTemplates.map((template, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <h3 className="font-medium">{template.title}</h3>
                        
                        <div className="mt-3">
                          <p className="text-sm font-medium">Template:</p>
                          <p className="text-sm bg-secondary/50 p-2 rounded mt-1">
                            {template.template}
                          </p>
                        </div>
                        
                        <div className="mt-3">
                          <p className="text-sm font-medium">Example:</p>
                          <p className="text-sm bg-secondary/50 p-2 rounded mt-1">
                            {template.example}
                          </p>
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="mt-2"
                            onClick={() => copyToClipboard(template.example)}
                          >
                            <Copy size={14} className="mr-1" /> Copy
                          </Button>
                        </div>
                        
                        <div className="mt-3">
                          <p className="text-sm font-medium">Tips:</p>
                          <ul className="text-sm list-disc list-inside mt-1">
                            {template.tips.map((tip, i) => (
                              <li key={i}>{tip}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default PracticePrompting; 