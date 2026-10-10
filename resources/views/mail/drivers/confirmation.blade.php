@component('mail.drivers.layout', ['title' => 'Application received', 'tagline' => 'Application received'])
    <div style="font-size:15px;line-height:1.7;">
        {!! $bodyHtml !!}
    </div>
@endcomponent
